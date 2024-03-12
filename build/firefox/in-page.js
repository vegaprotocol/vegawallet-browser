(function () {
  'use strict';

  /**
   * Validate whether a message is a JSON-RPC notification (ie no id)
   * @param {object} message
   * @returns {boolean}
   */
  function isNotification(message) {
    return (
      message?.jsonrpc === '2.0' && 'method' in message && message?.id == null
    )
  }

  /**
   * Validate whether a message is a JSON-RPC response (ie has id and result or error)
   * @param {object} message
   * @returns {boolean}
   */
  function isResponse(message) {
    return (
      message?.jsonrpc === '2.0' &&
      message?.id != null &&
      ('result' in message || 'error' in message)
    )
  }

  /**
   * JSON-RPC Error class that is serializable to JSON
   * @extends Error
   * @constructor
   * @param {string} message
   * @param {number} code
   * @param {any} data
   * @returns {JSONRPCError}
   */
  class JSONRPCError extends Error {
    constructor(message, code, data) {
      super(message);
      this.code = code;
      this.data = data;
    }

    toJSON() {
      return { message: this.message, code: this.code, data: this.data }
    }
  }

  class JSONRPCClient {
    static Error = JSONRPCError

    constructor({
      send,
      onnotification = (_) => {},
      idPrefix = Math.random().toString(36)
    }) {
      this._send = send;
      this._onnotification = onnotification ?? (() => {});
      this.inflight = new Map();
      this.id = 0;
      this._idPrefix = idPrefix;
    }

    notify(method, params) {
      const msg = {
        jsonrpc: '2.0',
        method,
        params
      };

      this._send(msg);
    }

    async request(method, params) {
      const id = this._idPrefix + ++this.id;
      const msg = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      return new Promise((resolve, reject) => {
        this.inflight.set(id, [resolve, reject]);

        this._send(msg);
      })
    }

    /**
     *
     * @param {any} data
     * @returns
     */
    async onmessage(data) {
      if (data == null) return // invalid response

      if (isNotification(data)) return this._onnotification(data) // JSON-RPC notifications are not supported for now

      // Only react to responses and notifications
      if (!isResponse(data)) return

      const id = data.id;
      const p = this.inflight.get(id);
      if (p == null) return // duplicate or unknown response

      this.inflight.delete(id);

      if (data.error) {
        const err = new JSONRPCClient.Error(
          data.error.message,
          data.error.code,
          data.error.data
        );
        p[1](err);
        return
      }

      p[0](data.result);
    }
  }

  /**
   * A Map-like object that allows a set of values per key
   * @extends {Map}
   * @template K
   * @template V
   */
  class KeyedSet extends Map {
    /**
     * Add a value to the set at the given key
     *
     * @param {K} key
     * @param {V} value
     * @returns {this}
     */
    add (key, value) {
      const s = this.get(key);

      if (s == null) {
        this.set(key, new Set([value]));
        return this
      }

      s.add(value);

      return this
    }

    /**
     * Delete a value from the set at the given key.
     * If value is null, delete the entire set.
     *
     * @param {K} key
     * @param {V} [value]
     * @returns {boolean}
     */
    delete (key, value) {
      if (value == null) return super.delete(key)

      const s = super.get(key);
      if (s == null) return false

      const res = s.delete(value);
      if (s.size === 0) {
        this.delete(key);
      }

      return res
    }

    values (key) {
      if (key == null) return super.values()

      return super.get(key) ?? new Set()
    }
  }

  class TinyEventemitter {
    constructor() {
      this._listeners = new KeyedSet();
    }

    /**
     * Adds a listener for the given event name.
     *
     * @param {string} name
     * @param {function} listener
     * @returns {function} A function that removes the listener.
     */
    on(name, listener) {
      this._listeners.add(name, listener);

      return () => {
        this.off(name, listener);
      }
    }

    /**
     * Removes a listener for the given event name. Omits the listener to remove
     * all listeners for the given event name.
     *
     * @param {string} name
     * @param {function} [listener]
     * @returns {boolean} Whether a listener was removed.
     */
    off(name, listener) {
      return this._listeners.delete(name, listener)
    }

    /**
     * Emits an event with the given name and arguments.
     *
     * @param {string} name
     * @param {...any} args
     */
    emit(name, ...args) {
      const listeners = this._listeners.get(name) || [];
      for (const listener of listeners) {
        try {
          listener(...args);
        } catch (err) {}
      }
    }
  }

  (() => {
    const events = new TinyEventemitter();

    const client = new JSONRPCClient({
      idPrefix: 'vega.in-page-',
      send(msg) {
        window.postMessage(msg, '*');
      },
      onnotification: (msg) => {
        events.emit(msg.method, msg.params);
      }
    });

    window.addEventListener(
      'message',
      (event) => {
        if (event.source !== window) return

        const data = event.data;

        // Only react to repsponses and notifications
        if (!isNotification(data) && !isResponse(data)) return

        client.onmessage(data);
      },
      false
    );

    // Define end-use API
    globalThis.vega = Object.freeze({
      async connectWallet(params = {}) {
        if (!params.chainId) {
          console.warn('Deprecated: client.connect_wallet should be called with a chainId');
        }
        return client.request('client.connect_wallet', params)
      },
      async disconnectWallet() {
        return client.request('client.disconnect_wallet', null)
      },
      async isConnected() {
        return client.request('client.is_connected', null)
      },
      async listKeys() {
        return client.request('client.list_keys', null)
      },
      async signTransaction(params) {
        return client.request('client.sign_transaction', params)
      },
      async sendTransaction(params) {
        return client.request('client.send_transaction', params)
      },
      async getChainId() {
        console.warn('Deprecated: select the preferred chainId using client.connect_wallet instead');
        return client.request('client.get_chain_id', null)
      },

      // Event API wrapped to protect prototype
      on(name, cb) {
        return events.on(name, cb)
      },
      off(name, cb) {
        return events.off(name, cb)
      },
      addEventListener(name, cb) {
        return events.on(name, cb)
      },
      removeEventListener(name, cb) {
        return events.off(name, cb)
      }
    });
  })();

})();
