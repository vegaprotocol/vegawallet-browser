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
   * Validate whether a message is a JSON-RPC request (ie has id)
   * @param {object} message
   * @returns {boolean}
   */
  function isRequest(message) {
    return (
      message?.jsonrpc === '2.0' &&
      typeof message?.method === 'string' &&
      message?.id != null
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

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var queueMicrotask_1 = typeof queueMicrotask === 'function' ? queueMicrotask : (fn) => Promise.resolve().then(fn);

  var queueTick = queueMicrotask_1;

  var mutexify$1 = function () {
    var queue = [];
    var used = null;

    var call = function () {
      used(release);
    };

    var acquire = function (fn) {
      if (used) return queue.push(fn)
      used = fn;
      acquire.locked = true;
      queueTick(call);
      return 0
    };

    acquire.locked = false;

    var release = function (fn, err, value) {
      used = null;
      acquire.locked = false;
      if (queue.length) acquire(queue.shift());
      if (fn) fn(err, value);
    };

    return acquire
  };

  var mutexify_1 = mutexify$1;

  var mutexify = mutexify_1;

  var mutexifyPromise = function () {
    var lock = mutexify();

    var acquire = function () {
      return new Promise(lock)
    };

    Object.defineProperty(acquire, 'locked', {
      get: function () { return lock.locked },
      enumerable: true
    });

    return acquire
  };

  var promise = mutexifyPromise;

  var mutex = /*@__PURE__*/getDefaultExportFromCjs(promise);

  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime;

  const U64_MAX$1 = 2n ** 64n - 1n;

  // Increase to make buckets twice as big, which will make
  // the amount of wasted work grow by a factor of NUM_WORKERS - 1, but
  // also make the overhead smaller (messages, context switch out of WASM when solving)
  const BUCKET_SIZE = 14n;

  const PARTITION_DIVISOR = U64_MAX$1 >> BUCKET_SIZE;

  async function initWorkers () {
    if (globalThis?.Worker == null || globalThis?.navigator?.hardwareConcurrency == null) return false

    const WORKER_SCRIPT_URL = runtime.getURL('pow-worker.js');

    // Use all but two cores for solving
    const NUM_WORKERS = Math.max(navigator.hardwareConcurrency - 2, 1);

    /* istanbul ignore next */
    const workers = Array.from({ length: NUM_WORKERS }, (_) => {
      const worker = new Worker(WORKER_SCRIPT_URL);

      const client = new JSONRPCClient({
        send (req) {
          worker.postMessage(req);
        }
      });
      worker.onmessage = (ev) => {
        client.onmessage(ev.data);
      };

      return client
    });

    // We create a lock queue so that we are not over-saturating with interleaved work
    const lock = mutex();

    /* istanbul ignore next */
    return async function (args) {
      const release = await lock();

      try {
        for (let i = 0; i < PARTITION_DIVISOR; i += NUM_WORKERS) {
          const res = await Promise.all(
            workers.map((w, j) => {
              const startNonce = (BigInt(i + j) * U64_MAX$1) / BigInt(PARTITION_DIVISOR);
              const endNonce = (BigInt(i + j + 1) * U64_MAX$1) / BigInt(PARTITION_DIVISOR);

              return w.request('solve', { ...args, startNonce, endNonce })
            })
          );

          const nonce = res.find((r) => r.nonce != null);

          if (nonce != null) return nonce
        }
      } finally {
        release();
      }
    }
  }

  var nanoassert = assert;

  class AssertionError extends Error {}
  AssertionError.prototype.name = 'AssertionError';

  /**
   * Minimal assert function
   * @param  {any} t Value to check if falsy
   * @param  {string=} m Optional assertion error message
   * @throws {AssertionError}
   */
  function assert (t, m) {
    if (!t) {
      var err = new AssertionError(m);
      if (Error.captureStackTrace) Error.captureStackTrace(err, assert);
      throw err
    }
  }

  var assert$1 = /*@__PURE__*/getDefaultExportFromCjs(nanoassert);

  const enc = new TextEncoder();

  /**
   * Convert a string to Uint8Array
   * @param  {string | Uint8Array} any
   * @return {Uint8Array}
   */
  function string (any) {
    if (any instanceof Uint8Array) return any
    return enc.encode(any)
  }

  new TextDecoder();

  /** @type {Uint8Array} BIP-0039 defined salt prefix */
  string('mnemonic');

  let wasm$1;

  let cachedUint8Memory0 = null;

  function getUint8Memory0 () {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
      cachedUint8Memory0 = new Uint8Array(wasm$1.memory.buffer);
    }
    return cachedUint8Memory0
  }

  let WASM_VECTOR_LEN = 0;

  function passArray8ToWasm0 (arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr
  }

  let cachedInt32Memory0 = null;

  function getInt32Memory0 () {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
      cachedInt32Memory0 = new Int32Array(wasm$1.memory.buffer);
    }
    return cachedInt32Memory0
  }

  function getArrayU8FromWasm0 (ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len)
  }
  /**
  * @param {Uint8Array} seed_bytes
  * @returns {Uint8Array}
  */
  function ed25519_keypair_from_seed (seed_bytes) {
    try {
      const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(seed_bytes, wasm$1.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.ed25519_keypair_from_seed(retptr, ptr0, len0);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      const v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm$1.__wbindgen_free(r0, r1 * 1);
      return v1
    } finally {
      wasm$1.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
  * @param {Uint8Array} digest
  * @param {Uint8Array} secret_key
  * @returns {Uint8Array}
  */
  function ed25519_sign (digest, secret_key) {
    try {
      const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(digest, wasm$1.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(secret_key, wasm$1.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm$1.ed25519_sign(retptr, ptr0, len0, ptr1, len1);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      const v2 = getArrayU8FromWasm0(r0, r1).slice();
      wasm$1.__wbindgen_free(r0, r1 * 1);
      return v2
    } finally {
      wasm$1.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
  * @param {Uint8Array} signature
  * @param {Uint8Array} digest
  * @param {Uint8Array} public_key
  * @returns {boolean}
  */
  function ed25519_verify (signature, digest, public_key) {
    const ptr0 = passArray8ToWasm0(signature, wasm$1.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(digest, wasm$1.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArray8ToWasm0(public_key, wasm$1.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm$1.ed25519_verify(ptr0, len0, ptr1, len1, ptr2, len2);
    return ret !== 0
  }

  /**
  * @param {Uint8Array} block_hash
  * @param {Uint8Array} tid
  * @param {bigint} nonce
  * @returns {Uint8Array}
  */
  function sha3r24_pow_hash (block_hash, tid, nonce) {
    try {
      const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(block_hash, wasm$1.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(tid, wasm$1.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm$1.sha3r24_pow_hash(retptr, ptr0, len0, ptr1, len1, nonce);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      const v2 = getArrayU8FromWasm0(r0, r1).slice();
      wasm$1.__wbindgen_free(r0, r1 * 1);
      return v2
    } finally {
      wasm$1.__wbindgen_add_to_stack_pointer(16);
    }
  }

  let cachedBigInt64Memory0 = null;

  function getBigInt64Memory0 () {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
      cachedBigInt64Memory0 = new BigInt64Array(wasm$1.memory.buffer);
    }
    return cachedBigInt64Memory0
  }
  /**
  * @param {number} difficulty
  * @param {Uint8Array} block_hash
  * @param {Uint8Array} tid
  * @param {bigint} start_nonce
  * @param {bigint} end_nonce
  * @returns {bigint | undefined}
  */
  function sha3r24_pow_solve (difficulty, block_hash, tid, start_nonce, end_nonce) {
    try {
      const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(block_hash, wasm$1.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(tid, wasm$1.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm$1.sha3r24_pow_solve(retptr, difficulty, ptr0, len0, ptr1, len1, start_nonce, end_nonce);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r2 = getBigInt64Memory0()[retptr / 8 + 1];
      return r0 === 0 ? undefined : BigInt.asUintN(64, r2)
    } finally {
      wasm$1.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
  * @param {Uint8Array} message
  * @returns {Uint8Array}
  */
  function sha3_256_hash (message) {
    try {
      const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(message, wasm$1.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.sha3_256_hash(retptr, ptr0, len0);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      const v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm$1.__wbindgen_free(r0, r1 * 1);
      return v1
    } finally {
      wasm$1.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
  * @param {Uint8Array} passphrase
  * @param {Uint8Array} salt
  * @param {number} iterations
  * @param {number} mem
  * @returns {Uint8Array}
  */
  function argon2id_kdf (passphrase, salt, iterations, mem) {
    try {
      const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(passphrase, wasm$1.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(salt, wasm$1.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm$1.argon2id_kdf(retptr, ptr0, len0, ptr1, len1, iterations, mem);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      const v2 = getArrayU8FromWasm0(r0, r1).slice();
      wasm$1.__wbindgen_free(r0, r1 * 1);
      return v2
    } finally {
      wasm$1.__wbindgen_add_to_stack_pointer(16);
    }
  }

  async function load (module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === 'function') {
        try {
          return await WebAssembly.instantiateStreaming(module, imports)
        } catch (e) {
          if (module.headers.get('Content-Type') != 'application/wasm') {
            console.warn('`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n', e);
          } else {
            throw e
          }
        }
      }

      const bytes = await module.arrayBuffer();
      return await WebAssembly.instantiate(bytes, imports)
    } else {
      const instance = await WebAssembly.instantiate(module, imports);

      if (instance instanceof WebAssembly.Instance) {
        return { instance, module }
      } else {
        return instance
      }
    }
  }

  function getImports () {
    const imports = {};
    imports.wbg = {};

    return imports
  }

  function finalizeInit (instance, module) {
    wasm$1 = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedBigInt64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;

    return wasm$1
  }

  function initSync (module) {
    const imports = getImports();

    if (!(module instanceof WebAssembly.Module)) {
      module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module)
  }

  async function init (input) {
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
      input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module)
  }

  const exports$1 = /* #__PURE__ */Object.freeze({
    __proto__: null,
    argon2id_kdf,
    default: init,
    ed25519_keypair_from_seed,
    ed25519_sign,
    ed25519_verify,
    initSync,
    sha3_256_hash,
    sha3r24_pow_hash,
    sha3r24_pow_solve
  });

  const base64codes = [62, 0, 0, 0, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 0, 0, 0, 0, 0, 0, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

  function getBase64Code (charCode) {
    return base64codes[charCode - 43]
  }

  function base64_decode (str) {
    const missingOctets = str.endsWith('==') ? 2 : str.endsWith('=') ? 1 : 0;
    const n = str.length;
    const result = new Uint8Array(3 * (n / 4));
    let buffer;

    for (let i = 0, j = 0; i < n; i += 4, j += 3) {
      buffer =
                      getBase64Code(str.charCodeAt(i)) << 18 |
                      getBase64Code(str.charCodeAt(i + 1)) << 12 |
                      getBase64Code(str.charCodeAt(i + 2)) << 6 |
                      getBase64Code(str.charCodeAt(i + 3));
      result[j] = buffer >> 16;
      result[j + 1] = (buffer >> 8) & 0xFF;
      result[j + 2] = buffer & 0xFF;
    }

    return result.subarray(0, result.length - missingOctets)
  }

  const wasm_code = base64_decode('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wAAQSSAFKAIYIAUoAhwQgwEhKiAFQRBqQRpBHSAMIAtBrKvAABBJIAUoAhAgBSgCFBCCASEyIAVBCGpBHEEgIAwgC0G8q8AAEEkgBSgCCCAFKAIMEIMBIUAgBEUNASAGIA5CAYhC////AIMiDiAPQgKIQv///wCDIg9+IBBCBIhC////AIMiECARQgeIIhF+fCAWQgaIQv///wCDIhYgEkIFiEL///8AgyISfnwgE0IDiCITIBVC////AIMiFX58IBdC////AIMiFyAUQgOIIhR+fCAZQgWIQv///wCDIhkgGEIGiEL///8AgyIYfnwgGkICiEL///8AgyIaIBtCAYhC////AIMiG358ICVCB4giJSAgQgSIQv///wCDIiB+fCAPIBB+ICRCB4hC////AIMiJCARfnwgDiASfnwgFSAWfnwgEyAUfnwgFyAYfnwgGSAbfnwgGiAgfnwgJSAfQgeIQv///wCDIh9+fCIvQoCAQH0iJ0IViHwiMCARICV+IiZCgIBAfSIoQhWIIjNC0asIfnwgMEKAgEB9IitCgICAf4N9ICYgKEKAgID/////A4N9IA8gJX4gESAafnwgDyAafiARIBl+fCASICV+fCIoQoCAQH0iLEIViHwiJkKAgEB9IjlCFYh8IjBCg6FWfnwgM0LTjEN+IC98ICdCgICAf4N9IA8gJH4gI0ICiEL///8AgyIjIBF+fCAQIBJ+fCAOIBV+fCAUIBZ+fCATIBh+fCAXIBt+fCAZICB+fCAaIB9+fCAlIB5CAohC////AIMiHn58IA8gI34gIkIFiEL///8AgyIiIBF+fCASICR+fCAQIBV+fCAOIBR+fCAWIBh+fCATIBt+fCAXICB+fCAZIB9+fCAaIB5+fCAlIB1CBYhC////AIMiHX58IkFCgIBAfSJCQhWIfCJDQoCAQH0iREIViHwgMELRqwh+fCAmIDlCgICA/////wCDfSIvQoOhVn58IjlCgIBAfSJFQhWHfCI6QoCAQH0iO0IVhyAPIBZ+IA4gEX58IBIgE358IBUgF358IBQgGX58IBggGn58IBsgJX58IicgM0KDoVZ+fCAnQoCAQH0iJkKAgIB/g30gK0IViHwiJyAnQoCAQH0iK0KAgIB/g318IidCg6FWfiAPIBN+IBEgFn58IBIgF358IBUgGX58IBQgGn58IBggJX58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IgcgBIVCMIkiBCAAQYgCaiIbKQMAIgMgAEEIaiIcKQMAIgh8IAhCAYZC/v///x+DIANC/////w+DfnwiCCAAQYgGaiIdKQMAhUIgiSILIABBiARqIh4pAwAiDHwgDEIBhkL+////H4MgC0L/////D4N+fCIMIAOFQiiJIgMgCHwgCEIBhkL+////H4MgA0L/////D4N+fCIIIAuFQjCJIgsgDHwgDEIBhkL+////H4MgC0L/////D4N+fCIMIAOFQgGJIgMgAEGAAmoiHykDACIPIAApAwAiCnwgCkIBhkL+////H4MgD0L/////D4N+fCIKIABBgAZqIiApAwCFQiCJIhAgAEGABGoiISkDACITfCATQgGGQv7///8fgyAQQv////8Pg358IhMgD4VCKIkiDyAKfCAKQgGGQv7///8fgyAPQv////8Pg358Igp8IApCAYZC/v///x+DIANC/////w+DfnwiCYVCIIkiFCAAQYADaiIiKQMAIhEgAEGAAWoiIykDACINfCANQgGGQv7///8fgyARQv////8Pg358Ig0gAEGAB2oiJCkDAIVCIIkiEiAAQYAFaiIAKQMAIg58IA5CAYZC/v///x+DIBJC/////w+DfnwiDiARhUIoiSIRIA18IA1CAYZC/v///x+DIBFC/////w+DfnwiDSAShUIwiSISIA58IA5CAYZC/v///x+DIBJC/////w+DfnwiDnwgDkIBhkL+////H4MgFEL/////D4N+fCIVIAOFQiiJIgMgCXwgCUIBhkL+////H4MgA0L/////D4N+fCIJNwMAIBkgCSAUhUIwiSIJNwMAIAAgCSAVfCAVQgGGQv7///8fgyAJQv////8Pg358Igk3AwAgGyADIAmFQgGJNwMAICAgBCAGfCAGQgGGQv7///8fgyAEQv////8Pg358IgQgDiARhUIBiSIGIAh8IAhCAYZC/v///x+DIAZC/////w+DfnwiAyAKIBCFQjCJIgiFQiCJIgp8IApCAYZC/v///x+DIARC/////w+DfnwiECAGhUIoiSIGIAN8IANCAYZC/v///x+DIAZC/////w+DfnwiCSAKhUIwiSIDNwMAIBwgCTcDACAaIAMgEHwgEEIBhkL+////H4MgA0L/////D4N+fCIDNwMAICIgAyAGhUIBiTcDACAdIAQgBYVCAYkiBSANfCANQgGGQv7///8fgyAFQv////8Pg358IgQgC4VCIIkiBiAIIBN8IBNCAYZC/v///x+DIAhC/////w+DfnwiA3wgA0IBhkL+////H4MgBkL/////D4N+fCIIIAWFQiiJIgUgBHwgBEIBhkL+////H4MgBUL/////D4N+fCILIAaFQjCJIgQ3AwAgIyALNwMAICEgBCAIfCAIQgGGQv7///8fgyAEQv////8Pg358IgQ3AwAgFyAEIAWFQgGJNwMAICQgByADIA+FQgGJIgV8IAVCAYZC/v///x+DIAdC/////w+DfnwiByAShUIgiSIEIAx8IAxCAYZC/v///x+DIARC/////w+DfnwiBiAFhUIoiSIFIAd8IAdCAYZC/v///x+DIAVC/////w+DfnwiAyAEhUIwiSIHNwMAIBggAzcDACAeIAYgB3wgBkIBhkL+////H4MgB0L/////D4N+fCIHNwMAIB8gBSAHhUIBiTcDACABQRBqIQEMAAsACwUgASACaiIAIABBOGoiFykDACIFIABBGGoiGCkDACIHfCAHQgGGQv7///8fgyAFQv////8Pg358IgcgAEH4AGoiGSkDAIVCIIkiBCAAQdgAaiIaKQMAIgZ8IAZCAYZC/v///x+DIARC/////w+DfnwiBiAFhUIoiSIFIAd8IAdCAYZC/v///x+DIAVC/////w+DfnwiByAEhUIwiSIEIABBKGoiGykDACIDIABBCGoiHCkDACIIfCAIQgGGQv7///8fgyADQv////8Pg358IgggAEHoAGoiHSkDAIVCIIkiCyAAQcgAaiIeKQMAIgx8IAxCAYZC/v///x+DIAtC/////w+DfnwiDCADhUIoiSIDIAh8IAhCAYZC/v///x+DIANC/////w+DfnwiCCALhUIwiSILIAx8IAxCAYZC/v///x+DIAtC/////w+DfnwiDCADhUIBiSIDIABBIGoiHykDACIPIAApAwAiCnwgCkIBhkL+////H4MgD0L/////D4N+fCIKIABB4ABqIiApAwCFQiCJIhAgAEFAayIhKQMAIhN8IBNCAYZC/v///x+DIBBC/////w+DfnwiEyAPhUIoiSIPIAp8IApCAYZC/v///x+DIA9C/////w+DfnwiCnwgCkIBhkL+////H4MgA0L/////D4N+fCIJhUIgiSIUIABBMGoiIikDACIRIABBEGoiIykDACINfCANQgGGQv7///8fgyARQv////8Pg358Ig0gAEHwAGoiJCkDAIVCIIkiEiAAQdAAaiIAKQMAIg58IA5CAYZC/v///x+DIBJC/////w+DfnwiDiARhUIoiSIRIA18IA1CAYZC/v///x+DIBFC/////w+DfnwiDSAShUIwiSISIA58IA5CAYZC/v///x+DIBJC/////w+DfnwiDnwgDkIBhkL+////H4MgFEL/////D4N+fCIVIAOFQiiJIgMgCXwgCUIBhkL+////H4MgA0L/////D4N+fCIJNwMAIBkgCSAUhUIwiSIJNwMAIAAgCSAVfCAVQgGGQv7///8fgyAJQv////8Pg358Igk3AwAgGyADIAmFQgGJNwMAICAgBCAGfCAGQgGGQv7///8fgyAEQv////8Pg358IgQgDiARhUIBiSIGIAh8IAhCAYZC/v///x+DIAZC/////w+DfnwiAyAKIBCFQjCJIgiFQiCJIgp8IApCAYZC/v///x+DIARC/////w+DfnwiECAGhUIoiSIGIAN8IANCAYZC/v///x+DIAZC/////w+DfnwiCSAKhUIwiSIDNwMAIBwgCTcDACAaIAMgEHwgEEIBhkL+////H4MgA0L/////D4N+fCIDNwMAICIgAyAGhUIBiTcDACAdIAQgBYVCAYkiBSANfCANQgGGQv7///8fgyAFQv////8Pg358IgQgC4VCIIkiBiAIIBN8IBNCAYZC/v///x+DIAhC/////w+DfnwiA3wgA0IBhkL+////H4MgBkL/////D4N+fCIIIAWFQiiJIgUgBHwgBEIBhkL+////H4MgBUL/////D4N+fCILIAaFQjCJIgQ3AwAgIyALNwMAICEgBCAIfCAIQgGGQv7///8fgyAEQv////8Pg358IgQ3AwAgFyAEIAWFQgGJNwMAICQgByADIA+FQgGJIgV8IAVCAYZC/v///x+DIAdC/////w+DfnwiByAShUIgiSIEIAx8IAxCAYZC/v///x+DIARC/////w+DfnwiBiAFhUIoiSIFIAd8IAdCAYZC/v///x+DIAVC/////w+DfnwiAyAEhUIwiSIHNwMAIBggAzcDACAeIAYgB3wgBkIBhkL+////H4MgB0L/////D4N+fCIHNwMAIB8gBSAHhUIBiTcDACABQYABaiEBDAELCyACIBYQWCQAC+kSAiJ/C34jACIIIRwgCEGAImtBQHEiByQAAkAgBkEISQRAQQYhCQwBCyAGQf////8ASwRAQQchCQwBCyAFRQRAQRAhCQwBCyAHQYAaaiIKQSQQgAEaIAdBgBJqIgggCkEkEIEBGiAKIAhBJBCBARogB0HwAGpBADYCACAHQegAakIANwMAIAdB5ABqQQE2AgAgB0HgAGogBTYCACAHQdwAaiAGNgIAIAdB2ABqQQA2AgAgB0ECOgCYASAHQhM3A1AgB0H0AGogCkEkEIEBGiAHQQA2AkggB0G4AWpCADcDACAHQbABakIANwMAIAdBqAFqQgA3AwAgB0IANwOgAQJAAkACQCAGQQEQbiIQRQRAQcAAIQoMAQsgEEH///8ASw0CIBBBCnQiCEEASA0CIAdBQGshCiAQQYCAgAFJQQZ0IQ4gCARAIAggDhAiIQ4LIAogCDYCBCAKIA42AgAgBygCQCIKRQ0BCyAHQYAaakGACBCAARpBASAQIBBBAU0bIhJBAWshCSAKIQgCQANAIAkEQCAJQQFrIQkgCCAHQYAaakGACBCBAUGACGohCAwBBSAQRQRAIBJBAWshEgwDCwsLIAggB0GAGmpBgAgQgQEaC0ELIQ8CQAJAAkACQCAEQQhJDQAgB0GAEmoiCBBCIAhBARBhIAhBIBBhIAggBhBhIAggBRBhIAhBExBhIAhBAhBhIAggAhBhIAggASACEBkgCCAEEGEgCCADIAQQGSAIQQAQYSAHQThqIAdB9ABqIgUQUSAIIAcoAjwQYSAHQTBqIAUQUSAIIAcoAjAgBygCNBAZIAdBgBpqIgUgCEHQARCBARogB0HAAWogBRBaQQYhDyAHKAJcIAcoAmQQbiILIBJLIgUNACAHKAJcIAcoAmQQWyETIAdB4ABqNQIAIS0gBygCXCAHKAJkEHciDEUNA0EAIAogBRshFCAHKAJkIRggCyALIAxwayENQQAhBSAMQQp0IREgCiEIA0AgDCANSwRAIBNBf3MhHSAMQQFrIR4gDCATayEfIActAJgBIhmtQv8BgyEuIBitIS8gC60hMCAHKAJQQRBGISAgGUECRiEhA0AgKyAtUgRAICtCAXwhMSAgICtQIhpyISIgGiAhcSEjQgAhKUEAIRUDQCApQgRRBEAgMSErDAMFQQAgEyApQgF8IjKnbEEAIClCA1IbIBobISRBfyAeICkgK4RQIhYbQX8gKVAiJRshJiATICmnbCEXIBZBAXQhESAWICMgKUICVHEgGUEBRnIiG3EhJ0IAISogFSEGAkACQAJAAkACQANAICogL1ENBSAHQYACakGACBCAARogB0GACmpBgAgQgAEaIAdBgBJqQYAIEIABGiAbBEAgByAuNwOoCiAHIC03A6AKIAcgMDcDmAogByApNwOQCiAHICo3A4gKIAcgKzcDgAoLIBEhCSAqQgF8ITMgJwRAIAdBgAJqIAdBgApqIAdBgBJqEExBAiEJCyATIAkgCSATSRshKCAUIAYgCWpBCnRqIQ8gJiAMICqnIg5sIBdqIAlqaiEIA0AgCSAoRgRAIAYgDGohBiAzISoMAgsCfyAbRQRAIAggC08NBCAUIAhBCnRqDAELIAlB/wBxIgVFBEAgB0GAAmogB0GACmogB0GAEmoQTAsgB0GAAmogBUEDdGoLKQMAISwgDiENICQCfwJAAkAgFkUEQCAsQiCIpyAYcCENICtCAFINASAlRQ0CCyAJQQFrDAILIB8gCUVrIA2tICpSDQEaIAkgHWogDGoMAQsgFyAJRWsgDa0gKlINABogCSAXakEBawsiBWogBa0gLEL/////D4MiLCAsfkIgiH5CIIinQX9zaiAMcCAIIAtPDQMgDCANbGoiDSALTw0EIAYgCWohBSAHQYAaaiAUIAhBCnRqIBQgDUEKdGoQAwJAAkAgIkUEQCAFIAtPDQIgDyAHQYAaahBYDAELIAUgC08NByAPIAdBgBpqQYAIEIEBGgsgCUEBaiEJIA9BgAhqIQ8gBSEIDAELCwsgBiAJaiALQaCLwAAQMwALIAggC0HgisAAEDMACyAIIAtB8IrAABAzAAsgDSALQYCLwAAQMwALIAYgCWogC0GQi8AAEDMACyATIBVqIRUgMiEpDAELAAsACwsgEiAHKAJcIAcoAmQQdyIRQQFrIgVLBEAgB0GAGmogCiAFQQp0akGACBCBARogEUEKdCEOIBFBAXRBAWshCCARQQt0IApqQYAIayEGQQEgBygCZCIFIAVBAU0bQQFrIQkCQANAIAlFDQEgCCASSQRAIAlBAWshCSAIIBFqIQggB0GAGmogBhBYIAYgDmohBgwBCwsgCCASQcCLwAAQMwALIAdBgAg2AoQSIAcgB0GAGmo2AoASIAdBgBJqQQEgB0GgAWpBIBAOQf8BcSEPDAMLIAUgEkGwi8AAEDMACyAMQQFGDQIgBUEBaiEOIA0gDGshDSAIIBFqIQZBACEJA0AgCUECRgRAIA4hBSAGIQgMAgsgByAJNgKACiAHQQQ2ApQaIAdBBDYCjBogB0HAADYChBogByAFNgKAEiAHIAdBgBJqNgKQGiAHIAdBgApqNgKIGiAHIAdBwAFqNgKAGiAHQYAaakEDIAhBgAgQDkH/AXEiD0ESRw0CIAhBgAhqIQggCUEBaiEJDAALAAsACyAQBEAgCiAQQQp0ECcLIA9BEkcNASAHQZgaaiIIIAdBuAFqKQMANwMAIAdBkBpqIgYgB0GwAWopAwA3AwAgB0GIGmoiBSAHQagBaikDADcDACAHIAcpA6ABNwOAGkEgEGoiCkEYaiAIKQMANwAAIApBEGogBikDADcAACAKQQhqIAUpAwA3AAAgCiAHKQOAGjcAACADIAQQbSABIAIQbSAAQSA2AgQgACAKNgIAIBwkAA8LQQJBAUHQisAAEHQACyAHIA86AIAaQciNwABBKyAHQYAaakHAgMAAQbyBwAAQLwALIAdBjBpqQQE2AgAgB0GUGmpBADYCACAHQdSFwAA2AogaIAdByLjAADYCkBogB0EANgKAGiAHQYAaakHAisAAEFkACwALIwBBIGsiACQAIABBFGpBATYCACAAQRxqQQA2AgAgAEH8gcAANgIQIABByLjAADYCGCAAQQA2AgggAEEIakGEgsAAEFkACyAHIAk6AIAaQciNwABBKyAHQYAaakHAgMAAQayBwAAQLwAL3BIBHn4gAEHAABCCASESIABBAmpBBBCDASETIABBBWpBAxCCASEUIABBB2pBBBCDASEZIABBCmpBBBCDASEaIABBDWpBAxCCASEbIABBD2pBBBCDASELIABBEmpBAxCCASEIIABBFWpBAxCCASEEIABBF2pBBBCDASEBIABBGmpBAxCCASEFIABBHGpBBBCDASEcIABBH2pBBBCDASEJIABBImpBAxCCASEVIABBJGpBBBCDASEKIABBJ2pBAxCCASEOIABBKmpBAxCCASEGIABBLGpBBBCDASEMIAAgAEEvakEDEIIBQgKIQv///wCDIgJC04xDfiABQgWIQv///wCDfCAAQTFqQQQQgwFCB4hC////AIMiAULn9id+fCAAQTRqQQQQgwFCBIhC////AIMiA0KY2hx+fCAAQTdqQQMQggFCAYhC////AIMiB0KT2Ch+fCACQuf2J34gBEL///8Ag3wgAUKY2hx+fCADQpPYKH58Ig9CgIBAfSIQQhWIfCINQoCAQH0iEUIVhyACQtGrCH4gBUICiEL///8Ag3wgAULTjEN+fCADQuf2J358IAdCmNocfnwgAEE5akEEEIMBQgaIQv///wCDIgRCk9gofnwiFnwgDEIFiEL///8AgyAAQTxqQQQQgwFCA4giBUKDoVZ+IAZC////AIN8IgxCgIBAfSIXQhWHfCIGQoOhVn58IBZCgIBAfSIWQoCAgH+DfSIYIBhCgIBAfSIYQoCAgH+DfSANIBFCgICAf4N9IAZC0asIfnwgDCAXQoCAgH+DfSAEQoOhVn4gDkIDiHwgBULRqwh+fCAHQoOhVn4gCkIGiEL///8Ag3wgBELRqwh+fCAFQtOMQ358Ig5CgIBAfSIMQhWHfCINQoCAQH0iEUIVh3wiCkKDoVZ+fCAPIAJCmNocfiAIQgOIfCABQpPYKH58IAJCk9gofiALQgaIQv///wCDfCIPQoCAQH0iF0IViHwiCEKAgEB9Ih1CFYh8IBBCgICA////B4N9IAZC04xDfnwgCkLRqwh+fCANIBFCgICAf4N9IgtCg6FWfnwiEEKAgEB9Ig1CFYd8IhFCgIBAfSIeQhWHfCARIB5CgICAf4N9IBAgDUKAgIB/g30gCCAdQoCAgP///weDfSAGQuf2J358IApC04xDfnwgC0LRqwh+fCAOIAxCgICAf4N9IANCg6FWfiAVQgGIQv///wCDfCAHQtGrCH58IARC04xDfnwgBULn9id+fCABQoOhVn4gCUIEiEL///8Ag3wgA0LRqwh+fCAHQtOMQ358IARC5/YnfnwgBUKY2hx+fCIVQoCAQH0iDkIVh3wiCUKAgEB9IgxCFYd8IghCg6FWfnwgDyAXQoCAgP///wGDfSAGQpjaHH58IApC5/YnfnwgC0LTjEN+fCAIQtGrCH58IAkgDEKAgIB/g30iCUKDoVZ+fCIMQoCAQH0iD0IVh3wiEEKAgEB9Ig1CFYd8IBAgDUKAgIB/g30gDCAPQoCAgH+DfSAGQpPYKH4gG0IBiEL///8Ag3wgCkKY2hx+fCALQuf2J358IBUgDkKAgIB/g30gAkKDoVZ+IBxCB4hC////AIN8IAFC0asIfnwgA0LTjEN+fCAHQuf2J358IARCmNocfnwgBUKT2Ch+fCAWQhWHfCIBQoCAQH0iA0IVh3wiAkKDoVZ+fCAIQtOMQ358IAlC0asIfnwgCkKT2Ch+IBpCBIhC////AIN8IAtCmNocfnwgAkLRqwh+fCAIQuf2J358IAlC04xDfnwiB0KAgEB9IgRCFYd8IgVCgIBAfSIGQhWHfCAFIAEgA0KAgIB/g30gGEIVh3wiA0KAgEB9IgpCFYciAUKDoVZ+fCAGQoCAgH+DfSABQtGrCH4gB3wgBEKAgIB/g30gC0KT2Ch+IBlCB4hC////AIN8IAJC04xDfnwgCEKY2hx+fCAJQuf2J358IAJC5/YnfiAUQgKIQv///wCDfCAIQpPYKH58IAlCmNocfnwiB0KAgEB9IgRCFYd8IgVCgIBAfSIGQhWHfCAFIAFC04xDfnwgBkKAgIB/g30gAULn9id+IAd8IARCgICAf4N9IAJCmNocfiATQgWIQv///wCDfCAJQpPYKH58IAJCk9gofiASQv///wCDfCICQoCAQH0iB0IVh3wiBEKAgEB9IgVCFYd8IAFCmNocfiAEfCAFQoCAgH+DfSACIAdCgICAf4N9IAFCk9gofnwiAUIVh3wiB0IVh3wiBEIVh3wiBUIVh3wiBkIVh3wiC0IVh3wiCEIVh3wiCUIVh3wiEkIVh3wiE0IVh3wiFEIVhyADIApCgICAf4N9fCIKQhWHIgJCk9gofiABQv///wCDfCIDPAAAIAAgA0IIiDwAASAAIAJCmNocfiAHQv///wCDfCADQhWHfCIBQguIPAAEIAAgAUIDiDwAAyAAIANCEIhCH4MgAUIFhoQ8AAIgACACQuf2J34gBEL///8Ag3wgAUIVh3wiA0IGiDwABiAAIANCAoYgAUKAgOAAg0ITiIQ8AAUgACACQtOMQ34gBUL///8Ag3wgA0IVh3wiAUIJiDwACSAAIAFCAYg8AAggACABQgeGIANCgID/AINCDoiEPAAHIAAgAkLRqwh+IAZC////AIN8IAFCFYd8IgNCDIg8AAwgACADQgSIPAALIAAgA0IEhiABQoCA+ACDQhGIhDwACiAAIAJCg6FWfiALQv///wCDfCADQhWHfCIBQgeIPAAOIAAgAUIBhiADQoCAwACDQhSIhDwADSAAIAhC////AIMgAUIVh3wiAkIKiDwAESAAIAJCAog8ABAgACACQgaGIAFCgID+AINCD4iEPAAPIAAgCUL///8AgyACQhWHfCIBQg2IPAAUIAAgAUIFiDwAEyAAIBJC////AIMgAUIVh3wiAzwAFSAAIAFCA4YgAkKAgPAAg0ISiIQ8ABIgACADQgiIPAAWIAAgE0L///8AgyADQhWHfCICQguIPAAZIAAgAkIDiDwAGCAAIANCEIhCH4MgAkIFhoQ8ABcgACAUQv///wCDIAJCFYd8IgFCBog8ABsgACABQgKGIAJCgIDgAINCE4iEPAAaIAAgCkL///8AgyABQhWHfCICQhGIPAAfIAAgAkIJiDwAHiAAIAJCAYg8AB0gACACQgeGIAFCgID/AINCDoiEPAAcC7INAQV/IwBB4AhrIgIkACACIAEQPCACQShqIgQgAhBzIAJB8AFqIgMgBEEoEIEBGiACQdAAaiIFIANBwJTAABA9IAJB8AFqIAJBKGpBKBCBARogAkG4CGoiBCADQZCVwAAQSyACQfgAaiIGIARBwJTAABBKIAQgBUEoEIEBGiADIAZBKBCBARogAkHIAWoiBSAEIAMQSyACQZADaiIDIAUQcyACQbgDaiADQSgQgQEaQQAhAwNAIANBAkZFBEAgAkHwAWoiBCACQbgDaiIFQSgQgQEaIAIgAzYCmAIgA0EBaiEDIAUgBBBzDAELCyACQfABaiIDIAJBuANqQSgQgQEaIAJB4ANqIgUgAkHIAWogAxBLIAJBuAhqIgQgAkGQA2pBKBCBARogAyAFQSgQgQEaIAJBiARqIgYgBCADEEsgAyAGEHMgBCAFQSgQgQEaIAJBsARqIgUgBCADEEsgAkHYBGogBUEoEIEBGkEAIQMDQCADQQVGRQRAIAJB8AFqIgQgAkHYBGoiBUEoEIEBGiACIAM2ApgCIANBAWohAyAFIAQQcwwBCwsgAkG4CGoiAyACQdgEakEoEIEBGiACQfABaiIEIAJBsARqQSgQgQEaIAJBgAVqIgUgAyAEEEsgAkGoBWogBUEoEIEBGkEAIQMDQCADQQpGRQRAIAJB8AFqIgQgAkGoBWoiBUEoEIEBGiACIAM2ApgCIANBAWohAyAFIAQQcwwBCwsgAkG4CGoiAyACQagFakEoEIEBGiACQfABaiIEIAJBgAVqQSgQgQEaIAJB0AVqIgUgAyAEEEsgAkH4BWogBUEoEIEBGkEAIQMDQCADQRRGRQRAIAJB8AFqIgQgAkH4BWoiBUEoEIEBGiACIAM2ApgCIANBAWohAyAFIAQQcwwBCwsgAkG4CGoiAyACQfgFakEoEIEBGiACQfABaiIEIAJB0AVqQSgQgQEaIAJBoAZqIAMgBBBLQQAhAwNAIANBCkZFBEAgAkHwAWoiBCACQaAGaiIFQSgQgQEaIAIgAzYCmAIgA0EBaiEDIAUgBBBzDAELCyACQbgIaiIDIAJBoAZqQSgQgQEaIAJB8AFqIgQgAkGABWpBKBCBARogAkHIBmoiBSADIAQQSyACQfAGaiAFQSgQgQEaQQAhAwNAIANBMkZFBEAgAkHwAWoiBCACQfAGaiIFQSgQgQEaIAIgAzYCmAIgA0EBaiEDIAUgBBBzDAELCyACQbgIaiIDIAJB8AZqQSgQgQEaIAJB8AFqIgQgAkHIBmpBKBCBARogAkGYB2oiBSADIAQQSyACQcAHaiAFQSgQgQEaQQAhAwNAIANB5ABGRQRAIAJB8AFqIgQgAkHAB2oiBUEoEIEBGiACIAM2ApgCIANBAWohAyAFIAQQcwwBCwsgAkG4CGoiAyACQcAHakEoEIEBGiACQfABaiIEIAJBmAdqQSgQgQEaIAJB6AdqIAMgBBBLQQAhAwNAIANBMkZFBEAgAkHwAWoiBCACQegHaiIFQSgQgQEaIAIgAzYCmAIgA0EBaiEDIAUgBBBzDAELCyACQZAIaiIDIAJB6AdqQSgQgQEaIAJB8AFqIgQgAkHIBmpBKBCBARogAkG4CGogAyAEEEtBACEDA0AgA0ECRkUEQCACQfABaiIEIAJBuAhqIgVBKBCBARogAiADNgKYAiADQQFqIQMgBSAEEHMMAQsLIAJB8AFqIgMgAkG4CGoiBEEoEIEBGiACQZAIaiIFIAMgAkHIAWoQSyADIAJB0ABqQSgQgQEaIAJBoAFqIgYgBSADEEsgBCAGEHMgAyACQfgAakEoEIEBGiACQcAHaiIFIAQgAxBLIAQgBUEoEIEBGiACQfABaiACQdAAakEoEIEBGiACQegHaiIFIAQgAxA9AkACQCAFED8NACACQbgIaiIDIAJBwAdqQSgQgQEaIAJB8AFqIgQgAkHQAGpBKBCBARogAkGQCGoiBSADIAQQSiAFED8EQCACQfABaiIDIAJBoAFqIgRBKBCBARogBCADQeiUwAAQSwwBCyAAQgA3AwAMAQsgAkGgAWoQYyABLAAfQQBOcwRAIAJB8AFqIgEgAkGgAWoiAxBwIAMgAUEoEIEBGgsgAkGQCGoiASACQaABaiIDQSgQgQEaIAJBuAhqIgQgAkEoEIEBGiACQegCaiABIAQQSyACQfABaiIBIANBKBCBARogAkGYAmogAkEoEIEBGiACQcACakHAlMAAQSgQgQEaIABBCGogAUGgARCBARogAEIBNwMACyACQeAIaiQAC7kNAQt/AkACQCAAKAIIIgogACgCECIDcgRAAkAgA0UNACABIAJqIQkgAEEUaigCAEEBaiEHIAEhBANAAkAgBCEDIAdBAWsiB0UNACADIAlGDQICfyADLAAAIgVBAE4EQCAFQf8BcSEFIANBAWoMAQsgAy0AAUE/cSEIIAVBH3EhBCAFQV9NBEAgBEEGdCAIciEFIANBAmoMAQsgAy0AAkE/cSAIQQZ0ciEIIAVBcEkEQCAIIARBDHRyIQUgA0EDagwBCyAEQRJ0QYCA8ABxIAMtAANBP3EgCEEGdHJyIgVBgIDEAEYNAyADQQRqCyIEIAYgA2tqIQYgBUGAgMQARw0BDAILCyADIAlGDQAgAywAACIEQQBOIARBYElyIARBcElyRQRAIARB/wFxQRJ0QYCA8ABxIAMtAANBP3EgAy0AAkE/cUEGdCADLQABQT9xQQx0cnJyQYCAxABGDQELAkACQCAGRQ0AIAIgBk0EQEEAIQMgAiAGRg0BDAILQQAhAyABIAZqLAAAQUBIDQELIAEhAwsgBiACIAMbIQIgAyABIAMbIQELIApFDQIgAEEMaigCACELAkACQAJAIAJBEE8EQCACIAFBA2pBfHEiAyABayIJSSAJQQRLcg0CIAIgCWsiCEEESQ0CIAhBA3EhCkEAIQZBACEEAkAgASADRg0AIAlBA3EhBQJAIAMgAUF/c2pBA0kEQCABIQMMAQsgCUF8cSEHIAEhAwNAIAQgAywAAEG/f0pqIAMsAAFBv39KaiADLAACQb9/SmogAywAA0G/f0pqIQQgA0EEaiEDIAdBBGsiBw0ACwsgBUUNAANAIAQgAywAAEG/f0pqIQQgA0EBaiEDIAVBAWsiBQ0ACwsgASAJaiEDAkAgCkUNACADIAhBfHFqIgUsAABBv39KIQYgCkEBRg0AIAYgBSwAAUG/f0pqIQYgCkECRg0AIAYgBSwAAkG/f0pqIQYLIAhBAnYhByAEIAZqIQQDQCADIQYgB0UNBEHAASAHIAdBwAFPGyIJQQNxIQggCUECdCEMAkAgCUH8AXEiCkUEQEEAIQUMAQsgBiAKQQJ0aiENQQAhBQNAIANFDQEgBSADKAIAIgVBf3NBB3YgBUEGdnJBgYKECHFqIANBBGooAgAiBUF/c0EHdiAFQQZ2ckGBgoQIcWogA0EIaigCACIFQX9zQQd2IAVBBnZyQYGChAhxaiADQQxqKAIAIgVBf3NBB3YgBUEGdnJBgYKECHFqIQUgA0EQaiIDIA1HDQALCyAHIAlrIQcgBiAMaiEDIAVBCHZB/4H8B3EgBUH/gfwHcWpBgYAEbEEQdiAEaiEEIAhFDQALIAZFBEBBACEDDAILIAYgCkECdGoiBigCACIDQX9zQQd2IANBBnZyQYGChAhxIQMgCEEBRg0BIAMgBigCBCIDQX9zQQd2IANBBnZyQYGChAhxaiEDIAhBAkYNASADIAYoAggiA0F/c0EHdiADQQZ2ckGBgoQIcWohAwwBCyACRQRAQQAhBAwDCyACQQNxIQUCQCACQQRJBEBBACEEIAEhAwwBCyACQXxxIQdBACEEIAEhAwNAIAQgAywAAEG/f0pqIAMsAAFBv39KaiADLAACQb9/SmogAywAA0G/f0pqIQQgA0EEaiEDIAdBBGsiBw0ACwsgBUUNAgNAIAQgAywAAEG/f0pqIQQgA0EBaiEDIAVBAWsiBQ0ACwwCCyADQQh2Qf+BHHEgA0H/gfwHcWpBgYAEbEEQdiAEaiEEDAELIAJBfHEhBUEAIQQgASEDA0AgBCADLAAAQb9/SmogAywAAUG/f0pqIAMsAAJBv39KaiADLAADQb9/SmohBCADQQRqIQMgBUEEayIFDQALIAJBA3EiBkUNAEEAIQUDQCAEIAMgBWosAABBv39KaiEEIAYgBUEBaiIFRw0ACwsgBCALSQRAIAsgBGsiBCEGAkACQAJAIAAtACAiA0EAIANBA0cbIgNBAWsOAgABAgtBACEGIAQhAwwBCyAEQQF2IQMgBEEBakEBdiEGCyADQQFqIQMgAEEEaigCACEEIAAoAhwhBSAAKAIAIQACQANAIANBAWsiA0UNASAAIAUgBCgCEBEBAEUNAAtBAQ8LQQEhAyAFQYCAxABGDQIgACABIAIgBCgCDBEAAA0CQQAhAwNAIAMgBkYEQEEADwsgA0EBaiEDIAAgBSAEKAIQEQEARQ0ACyADQQFrIAZJDwsMAgsgACgCACABIAIgACgCBCgCDBEAACEDCyADDwsgACgCACABIAIgACgCBCgCDBEAAAvZCAEFfyMAQeAFayICJAAgAkEIaiIFIAEQcyACQYgFaiIDIAUQcyACQbAFaiIEIAMQcyACQTBqIgYgASAEEEsgAyAFQSgQgQEaIAQgBkEoEIEBGiACQdgAaiIBIAMgBBBLIAQgARBzIAMgBkEoEIEBGiACQYABaiIBIAMgBBBLIAJBqAFqIAFBKBCBARpBACEBA0AgAUEFRkUEQCACQbAFaiIDIAJBqAFqIgRBKBCBARogAiABNgLYBSABQQFqIQEgBCADEHMMAQsLIAJBiAVqIgEgAkGoAWpBKBCBARogAkGwBWoiAyACQYABakEoEIEBGiACQdABaiIEIAEgAxBLIAJB+AFqIARBKBCBARpBACEBA0AgAUEKRkUEQCACQbAFaiIDIAJB+AFqIgRBKBCBARogAiABNgLYBSABQQFqIQEgBCADEHMMAQsLIAJBiAVqIgEgAkH4AWpBKBCBARogAkGwBWoiAyACQdABakEoEIEBGiACQaACaiIEIAEgAxBLIAJByAJqIARBKBCBARpBACEBA0AgAUEURkUEQCACQbAFaiIDIAJByAJqIgRBKBCBARogAiABNgLYBSABQQFqIQEgBCADEHMMAQsLIAJBiAVqIgEgAkHIAmpBKBCBARogAkGwBWoiAyACQaACakEoEIEBGiACQfACaiABIAMQS0EAIQEDQCABQQpGRQRAIAJBsAVqIgMgAkHwAmoiBEEoEIEBGiACIAE2AtgFIAFBAWohASAEIAMQcwwBCwsgAkGIBWoiASACQfACakEoEIEBGiACQbAFaiIDIAJB0AFqQSgQgQEaIAJBmANqIgQgASADEEsgAkHAA2ogBEEoEIEBGkEAIQEDQCABQTJGRQRAIAJBsAVqIgMgAkHAA2oiBEEoEIEBGiACIAE2AtgFIAFBAWohASAEIAMQcwwBCwsgAkGIBWoiASACQcADakEoEIEBGiACQbAFaiIDIAJBmANqQSgQgQEaIAJB6ANqIgQgASADEEsgAkGQBGogBEEoEIEBGkEAIQEDQCABQeQARkUEQCACQbAFaiIDIAJBkARqIgRBKBCBARogAiABNgLYBSABQQFqIQEgBCADEHMMAQsLIAJBiAVqIgEgAkGQBGpBKBCBARogAkGwBWoiAyACQegDakEoEIEBGiACQbgEaiABIAMQS0EAIQEDQCABQTJGRQRAIAJBsAVqIgMgAkG4BGoiBEEoEIEBGiACIAE2AtgFIAFBAWohASAEIAMQcwwBCwsgAkGIBWoiASACQbgEakEoEIEBGiACQbAFaiIDIAJBmANqQSgQgQEaIAJB4ARqIAEgAxBLQQAhAQNAIAFBBUZFBEAgAkGwBWoiAyACQeAEaiIEQSgQgQEaIAIgATYC2AUgAUEBaiEBIAQgAxBzDAELCyACQYgFaiIBIAJB4ARqQSgQgQEaIAJBsAVqIgMgAkHYAGpBKBCBARogACABIAMQSyACQeAFaiQAC5UIAi1+AX8gACkDwAEhDiAAKQOYASEBIAApA3AhDyAAKQNIIRAgACkDICECIAApA7gBIQMgACkDkAEhBiAAKQNoIQQgACkDQCEJIAApAxghByAAKQOwASERIAApA4gBIRIgACkDYCETIAApAzghFCAAKQMQIQUgACkDqAEhCiAAKQOAASEVIAApA1ghFiAAKQMwIRcgACkDCCEYIAApA6ABIQggACkDeCEZIAApA1AhGiAAKQMoIRsgACkDACEcQcB+IS4DQCAuBEAgGyAchSAahSAZhSAIhSILIAUgFIUgE4UgEoUgEYUiDEIBiYUiHSAXhSAHIAmFIASFIAaFIAOFIg0gC0IBiYUiCyAOhSEtIAogHYVCAokiHiAJIAIgEIUgD4UgAYUgDoUiCUIBiSAMhSIMhUI3iSIfIAUgFyAYhSAWhSAVhSAKhSIKIA1CAYmFIgWFQj6JIiBCf4WDhSEOIB8gCSAKQgGJhSINIBmFQimJIiEgCyAPhUIniSIiQn+Fg4UhCiAWIB2FQgqJIiMgAyAMhUI4iSIkIAUgEoVCD4kiJUJ/hYOFIRIgAiALhUIbiSImICMgDSAbhUIkiSInQn+Fg4UhGSAIIA2FQhKJIgggBSAUhUIGiSIoIBggHYVCAYkiKUJ/hYOFIQ8gASALhUIIiSIqIAQgDIVCGYkiK0J/hYMgKIUhFiAFIBGFQj2JIgEgCyAQhUIUiSICIAcgDIVCHIkiA0J/hYOFIRAgFSAdhUItiSIEIAMgAUJ/hYOFIQkgDSAahUIDiSIHIAEgBEJ/hYOFIRQgAiAEIAdCf4WDhSEXIAMgByACQn+Fg4UhGyAGIAyFQhWJIgEgDSAchSICIC1CDokiA0J/hYOFIQcgBSAThUIriSIGIAMgAUJ/hYOFIQVCLIkiBCABIAZCf4WDhSEYIC5BkL3AAGopAwAgBiAEQn+Fg4UgAoUhHCAuQQhqIS4gJCAnICZCf4WDhSEBIAMgBCACQn+Fg4UhAiAgIB5Cf4WDICGFIQMgJiAkQn+FgyAlhSEGICogKSAIQn+Fg4UhBCAiIB4gIUJ/hYOFIREgKyAIICpCf4WDhSETICUgI0J/hYMgJ4UhFSAiIB9Cf4WDICCFIQggKyAoQn+FgyAphSEaDAEFIAAgCDcDoAEgACAZNwN4IAAgGjcDUCAAIBs3AyggACAcNwMAIAAgCjcDqAEgACAVNwOAASAAIBY3A1ggACAXNwMwIAAgGDcDCCAAIBE3A7ABIAAgEjcDiAEgACATNwNgIAAgFDcDOCAAIAU3AxAgACADNwO4ASAAIAY3A5ABIAAgBDcDaCAAIAk3A0AgACAHNwMYIAAgDjcDwAEgACABNwOYASAAIA83A3AgACAQNwNIIAAgAjcDIAsLC6UHAQp/IwBB0DJrIgMkACADQcymwAAQPCADQShqIgRB7KbAABA8IANB0ABqIgUgA0EoEIEBGiADQfgAaiAEQSgQgQEaIANB8AFqIgYgA0EoEIEBGiADQZAcaiIHIARBKBCBARogA0HIAWogBiAHEEsgA0GgAWpBwJTAAEEoEIEBGiADQfAaaiAFEDBBACEEIAZBKBCAARogA0GYAmpBwJTAAEEoEIEBGiADQcACakHAlMAAQSgQgQEaIANB6AJqQSgQgAEaA0AgBEGAFEZFBEAgA0GQHGogBGogA0HwAWpBoAEQgQEaIARBoAFqIQQMAQsLIANBsB1qIANB0ABqQaABEIEBGiADQdAeaiEGQQIhBANAIARBEEYEQAJAQQAhBCADQfABakGAFBCAARoDQCAEQYAURg0BIANBsDFqIgYgA0GQHGogBGoQMCADQfABaiAEaiAGQaABEIEBGiAEQaABaiEEDAALAAsFAkAgBEEBcQRAIANBsDFqIgUgBkGgAWtBoAEQgQEaIANB8AFqIgcgA0HwGmpBoAEQgQEaIANBkDBqIgggBSAHEBEgBSAIECwMAQsgA0HwAWoiBSADQZAcaiAEQQF2QaABbGoQPiADQbAxaiAFECwLIARBAWohBCAGIANBsDFqQaABEIEBQaABaiEGDAELCyAAQSgQgAEiAEEoakHAlMAAQSgQgQEaIABB0ABqQcCUwABBKBCBARogAEH4AGpBKBCAARogA0HoFmohCSADQcAWaiEKIANBmBZqIQtB/AEhBgNAIAIgBkEDdiIESwRAIAEgBGotAAAgA0HwFWogA0HwAWpBoAEQgQEaIAZBBHF2QQ9xIQxBASEFQaBtIQQDQCAEBEAgA0HwFWogA0HwAWogBGoiB0GAFGogBSAMc0EBa0EIdkEBcSIIEEYgCyAHQagUaiAIEEYgCiAHQdAUaiAIEEYgCSAHQfgUaiAIEEYgBEGgAWohBCAFQQFqIQUMAQUgA0GwMWoiBCAAQaABEIEBGiADQZAcaiIFIANB8BVqQaABEIEBGiADQZAwaiIHIAQgBRARIAAgBxAsIAYEQCADQZAcaiIEIAAQPiADQbAxaiIFIAQQLCADQZAwaiIEIAUQPiADQfAaaiIFIAQQLCADQdAZaiIEIAUQPiADQbAYaiIFIAQQLCADQZAXaiIEIAUQPiAAIAQQLCAGQQRrIQYMBAsgA0HQMmokAA8LAAsACwsgBCACQbymwAAQMwAL3QYCDH8CfiMAQTBrIgYkAEEnIQICQCAANQIAIg5CkM4AVARAIA4hDwwBCwNAIAZBCWogAmoiAEEEayAOQpDOAIAiD0LwsQN+IA58pyIDQf//A3FB5ABuIgRBAXRBhJDAAGovAAA7AAAgAEECayAEQZx/bCADakH//wNxQQF0QYSQwABqLwAAOwAAIAJBBGshAiAOQv/B1y9WIA8hDg0ACwsgD6ciAEHjAEsEQCACQQJrIgIgBkEJamogD6ciA0H//wNxQeQAbiIAQZx/bCADakH//wNxQQF0QYSQwABqLwAAOwAACwJAIABBCk8EQCACQQJrIgIgBkEJamogAEEBdEGEkMAAai8AADsAAAwBCyACQQFrIgIgBkEJamogAEEwajoAAAtBJyACayEEQQEhAEErQYCAxAAgASgCGCIDQQFxIgUbIQggA0EddEEfdUHIuMAAcSEJIAZBCWogAmohCgJAIAEoAghFBEAgASgCACICIAFBBGooAgAiASAIIAkQVg0BIAIgCiAEIAEoAgwRAAAhAAwBCwJAAkACQAJAIAFBDGooAgAiByAEIAVqIgBLBEAgA0EIcQ0EIAcgAGsiACEDQQEgAS0AICICIAJBA0YbIgJBAWsOAgECAwtBASEAIAEoAgAiAiABQQRqKAIAIgEgCCAJEFYNBCACIAogBCABKAIMEQAAIQAMBAtBACEDIAAhAgwBCyAAQQF2IQIgAEEBakEBdiEDCyACQQFqIQIgAUEEaigCACEFIAEoAhwhByABKAIAIQECQANAIAJBAWsiAkUNASABIAcgBSgCEBEBAEUNAAtBASEADAILQQEhACAHQYCAxABGDQEgASAFIAggCRBWDQEgASAKIAQgBSgCDBEAAA0BQQAhAgJ/A0AgAyACIANGDQEaIAJBAWohAiABIAcgBSgCEBEBAEUNAAsgAkEBawsgA0khAAwBCyABKAIcIQwgAUEwNgIcIAEtACAhDUEBIQAgAUEBOgAgIAEoAgAiAyABQQRqKAIAIgsgCCAJEFYNACACIAdqIAVrQSZrIQIDQCACQQFrIgIEQCADQTAgCygCEBEBAEUNAQwCCwsgAyAKIAQgCygCDBEAAA0AIAEgDToAICABIAw2AhxBACEACyAGQTBqJAAgAAuUBwIBfwV+IwBB0AFrIgIkACACIAEQciACKQMgIQMgAikDGCEEIAIpAxAhBSACKQMIIQYgAikDACEHIAJCADcDKCACQQA6ADcgAkEoaiACQTdqQQAgB0Lt////////AxBdIAJCADcDOCACQQA6AEcgAkE4aiACQccAaiACLQA3IAZC/////////wMQXSACQgA3A0ggAkEAOgBXIAJByABqIAJB1wBqIAItAEcgBUL/////////AxBdIAJCADcDWCACQQA6AGcgAkHYAGogAkHnAGogAi0AVyAEQv////////8DEF0gAkIANwNoIAJBADoAdyACQegAaiACQfcAaiACLQBnIANC/////////wMQXSACQgA3A3ggAkH4AGogAi0Ad0IAQn8QaCACQgA3A4ABIAJBADoAjwEgAkGAAWogAkGPAWpBACACKQMoIAIpA3giA0Lt////////A4MQZCACQgA3A5ABIAJBADoAnwEgAkGQ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QQhqNgIYQQEgASADQRhqIAIRAQANABogAygCGEH8j8AAQQIgAygCHCgCDBEAAAs6AAggACAFQQFqNgIAIANBQGskACAAC7gCAQV/IwBBMGsiAyQAIAAgACgCxAEgAmo2AsQBIANBKGogACgCwAEiBCAEIAJBgAEgBGsiBiACIAZJGyIFaiAAQYCfwAAQSCADKAIsIQQgAygCKCADQSBqIAEgAkEAIAVBkJ/AABBHIAQgAygCICADKAIkQaCfwAAQZiAAIAAoAsABIAVqIgQ2AsABAkAgBEGAAUYEfyAAQYABaiAAQYABEBsaIABBADYCwAFBAAUgBAsgAiAGTXINACADQRhqIAEgAiAFQbCfwAAQXiAAQYABaiADKAIYIAMoAhwQGyIFRQ0AIANBEGpBACAFIABBwJ/AABBIIAMoAhQhBCADKAIQIANBCGogASACIAIgBWtB0J/AABBeIAQgAygCCCADKAIMQeCfwAAQZiAAIAU2AsABCyADQTBqJAALrAIBBX8jAEEwayIDJAAgACAAKALEASACajYCxAEgA0EoaiAAIAAoAsABIgQgBCACQYABIARrIgYgAiAGSRsiBWoQUCADKAIsIQQgAygCKCADQSBqQQAgBSABIAJBkJ/AABBJIAQgAygCICADKAIkQaCfwAAQZiAAIAAoAsABIAVqIgQ2AsABAkAgBEGAAUYEfyAAQYABaiAAQYABEBsaIABBADYCwAFBAAUgBAsgAiAGTXINACADQRhqIAEgAiAFQbCfwAAQXiAAQYABaiADKAIYIAMoAhwQGyIFRQ0AIANBEGogACAFEFQgAygCFCEEIAMoAhAgA0EIaiABIAIgAiAFa0HQn8AAEF4gBCADKAIIIAMoAgxB4J/AABBmIAAgBTYCwAELIANBMGokAAv9AQEDfyMAQdAAayIDJAAgACAAKQNAIAEtAIABIgStfDcDQCADQQhqIAFBgAEgBEGMhcAAEF4gAygCDCEEIAMoAgghBQNAIAQEQCAFQQA6AAAgBEEBayEEIAVBAWohBQwBCwsgAUEAOgCAASAAIAFCfxAAIANBKGogAEEYaikDADcDACADQSBqIABBEGopAwA3AwAgA0EYaiAAQQhqKQMANwMAIANBOGogAEEoaikDADcDACADQUBrIABBMGopAwA3AwAgA0HIAGogAEE4aikDADcDACADIAApAwA3AxAgAyAAKQMgNwMwIAIgA0EQakHAABCBARogA0HQAGokAAu3AgAgACABQQAgAkEHdCICQbCZwABqKQMAECMgACABQQEgAkG4mcAAaikDABAjIAAgAUECIAJBwJnAAGopAwAQIyAAIAFBAyACQciZwABqKQMAECMgACABQQQgAkHQmcAAaikDABAjIAAgAUEFIAJB2JnAAGopAwAQIyAAIAFBBiACQeCZwABqKQMAECMgACABQQcgAkHomcAAaikDABAjIAAgAUEIIAJB8JnAAGopAwAQIyAAIAFBCSACQfiZwABqKQMAECMgACABQQogAkGAmsAAaikDABAjIAAgAUELIAJBiJrAAGopAwAQIyAAIAFBDCACQZCawABqKQMAECMgACABQQ0gAkGYmsAAaikDABAjIAAgAUEOIAJBoJrAAGopAwAQIyAAIAFBDyACQaiawABqKQMAECMLhwIBBX8jAEHQA2siBSQAIAVBzAEQgAEiA0EGOwHQASADQYgBNgLMASADQfABaiIGQgA3AwAgA0HoAWoiBUIANwMAIANB4AFqIgRCADcDACADQgA3A9gBIAMgASACECsgA0H4AWoiByADQdgBEIEBGiAHIANB2AFqEBYgA0GQAmoiByAGKQMANwMAIANBiAJqIgYgBSkDADcDACADQYACaiIFIAQpAwA3AwAgAyADKQPYATcD+AFBIBBqIgRBGGogBykDADcAACAEQRBqIAYpAwA3AAAgBEEIaiAFKQMANwAAIAQgAykD+AE3AAAgASACEG0gAEEgNgIEIAAgBDYCACADQdADaiQAC/kBAQV/QQggASABQQhNGyEFQQggACAAQQhNG0EBayIAQYCAfHFBgIAEaiEGIABBeHFBCGohAEHgvcAAIQECQAJ/A0ACQCABIgQoAgAiAUF/RwRAIAEoAgQgAWoiAyAATQ0CIAMgAGsiAiACIAVwayICIAFJDQIgAyAAIAJqIgBLDQEgBCEAIAEMAwtBACECIAZBACAAGyIBQRB2QAAiBEF/Rg0DIARBEHQgARAnQeC9wAAhAQwBCwsgACABNgIAIAAgAyAAazYCBCAEIAA2AgAgACgCAAshAyABIAJHBEAgAyACIAFrNgIEIAIPCyAAIAMoAgA2AgALIAILjQICAX4BfyACQQ9NBEAgAUEHIAJrQQdxQQN0aiIF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A38jAEHQAGsiAyQAIAAoAkggAkcgAkHAAEtyIgVFBEAgA0EQaiIEEEUgACAAQcwAaiAEEB8gA0EIaiAEQcAAIAJB7IbAABBnIAEgAiADKAIIIAMoAgxB/IbAABBmCyADQdAAaiQAIAULWAEBfyMAQSBrIgIkACAAKAIAIQAgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAiAANgIEIAJBBGogAkEIahAPIAJBIGokAAtlAQJ/IwBBQGoiASQAIAFBwAAQgAEhAQNAIAJBwABGRQRAIAEgAmpBsJ7AAEHAACACEC43AwAgAkEIaiECDAELCyAAQYABaiABQcAAEIEBGiAAQYABEIABQgA3A8ABIAFBQGskAAtRAQF/IwBBIGsiAiQAIAIgADYCBCACQRhqIAFBEGopAgA3AwAgAkEQaiABQQhqKQIANwMAIAIgASkCADcDCCACQQRqIAJBCGoQDyACQSBqJAALfgAgACABKQAAQv////////8DgzcDACAAIAFBBmopAABCA4hC/////////wODNwMIIAAgAUEMaikAAEIGiEL/////////A4M3AxAgACABQRNqKQAAQgGIQv////////8DgzcDGCAAIAFBGGopAABCDIhC/////////wODNwMgC8oBAQN/IwBBgAFrIgUkACAFQQhqIgMgAUEoEIEBGiAFQTBqIgQgAkEoEIEBGiAFQdgAaiIBQSgQgAEaIAEgAykDICAEKQMgfUL+////////B3w3AyAgASADKQMYIAQpAxh9Qv7///////8HfDcDGCABIAMpAxAgBCkDEH1C/v///////wd8NwMQIAEgAykDCCAEKQMIfUL+////////B3w3AwggASADKQMAIAQpAwB9Qtr///////8HfDcDACAAIAEQciAFQYABaiQAC00BAn8jAEGAAWsiAiQAIAJBMGogAUEoakEoEIEBGiACQdgAaiABQdAAakEoEIEBGiACQQhqIgMgAUEoEIEBGiAAIAMQFCACQYABaiQAC0cBAn8jAEEgayIBJAAgASAAEAxBACEAA0AgAEEgRkUEQCAAIAFqLQAAIAJyIQIgAEEBaiEADAELCyABQSBqJAAgAkH/AXFFC0cBAn8jAEEgayECA0AgAUEQRkUEQCACQQhqIAFqQQA6AAAgAUEBaiEBDAELCyAAIAIpAwg3AAAgAEEIaiACQRBqKQMANwAAC1gBAX9B6L3AAEHovcAAKAIAIgFBAWo2AgACQCABQQBIDQBB7L3AAEHsvcAAKAIAQQFqIgE2AgAgAUECSw0AIABFQeS9wAAoAgBBAEggAUEBS3JyDQAACwALVwEBfyMAQeAAayIBJAAgAUEIakHAABAlIAEpAwhQRQRAQciNwABBKyABQdgAakHshcAAQaiDwAAQLwALIAAgAUEQakHIABCBAUHIAGoQQyABQeAAaiQAC0wBAn8jAEGQAWsiAiQAA0AgAUGAAUZFBEAgAkEIaiABakEAOgAAIAFBAWohAQwBCwsgACACQQhqQYABEIEBQQA6AIABIAJBkAFqJAALUQEBfyMAQSBrIgMkACADQQxqQQE2AgAgA0EUakEANgIAIANByLjAADYCECADQQA2AgAgAyABNgIcIAMgADYCGCADIANBGGo2AgggAyACEFkAC0cBAn8jAEHQAGsiAiQAA0AgAUHAAEZFBEAgAkEIaiABakEAOgAAIAFBAWohAQwBCwsgACACQQhqQcAAEIEBGiACQdAAaiQAC/0BAQJ/IwBB0ABrIgQkACAEIABBKBCBASIEQShqQSgQgAEaIwBBMGsiAyQAIANCADcDCCADQQhqIAIgBCkDACABKQMAEGggA0IANwMQIANBEGogAiAEKQMIIAEpAwgQaCADQgA3AxggA0EYaiACIAQpAxAgASkDEBBoIANCADcDICADQSBqIAIgBCkDGCABKQMYEGggA0IANwMoIANBKGogAiAEKQMgIAEpAyAQaCAEQShqIgEgAykDCDcDACABIAMpAxA3AwggASADKQMYNwMQIAEgAykDIDcDGCABIAMpAyg3AyAgA0EwaiQAIAAgAUEoEIEBGiAEQdAAaiQACzsAAkAgAyAETQRAIAIgBEkNASAAIAQgA2s2AgQgACABIANqNgIADwsgAyAEIAUQdQALIAQgAiAFEHQACzwAAkAgASACTQRAIAJBgAFNDQEgAkGAASAEEHQACyABIAIgBBB1AAsgACACIAFrNgIEIAAgASADajYCAAs6AAJAIAEgAk0EQCACIARNDQEgAiAEIAUQdAALIAEgAiAFEHUACyAAIAIgAWs2AgQgACABIANqNgIAC4gBAQF/IwBB0ABrIgMkACADIAFBKBCBASIBQShqIAJBKBCBARogAEEoEIABIgIgAUEoaiIAKQMgIAEpAyB8NwMgIAIgACkDGCABKQMYfDcDGCACIAApAxAgASkDEHw3AxAgAiAAKQMIIAEpAwh8NwMIIAIgACkDACABKQMAfDcDACABQdAAaiQAC88JAgF/FX4jAEHQAGsiAyQAIAMgAUEoEIEBIgFBKGogAkEoEIEBGiAAQSgQgAEhAiMAQZADayIDJAAgAyABQShqIgApAyAiCEITfiIJIAEpAyAiCxAyIANBEGogACkDGCINQhN+IgUgCxAyIANBIGogACkDECIKQhN+IgQgCxAyIANBMGogACkDCCIMQhN+IAsQMiADQdAAaiABKQMYIgYgCRAyIANB4ABqIAYgBRAyIANB8ABqIAYgBBAyIANBoAFqIAEpAxAiByAJEDIgA0GwAWogByAFEDIgA0HwAWogASkDCCIEIAkQMiADQUBrIAApAwAiBSALEDIgA0GAAWogBiAMEDIgA0GQAWogBSAGEDIgA0HAAWogByAKEDIgA0HQAWogByAMEDIgA0HgAWogBSAHEDIgA0GAAmogBCANEDIgA0GQAmogBCAKEDIgA0GgAmogBCAMEDIgA0GwAmogBSAEEDIgA0HQAmogASkDACIEIAgQMiADQeACaiAEIA0QMiADQfACaiAEIAoQMiADQYADaiAEIAwQMiADQcACaiAEIAUQMiACIAMpA9ABIg0gAykDAHwiDiADKQOQAnwiDyADKQOQAXwiECADKQPgAnwiESADKQNQIgUgAykDEHwiEiADKQOgAnwiEyADKQPgAXwiFCADKQPwAnwiFSADKQNgIgggAykDIHwiFiADKQOgAXwiFyADKQOwAnwiGCADKQOAA3wiBiADKQMwIgQgAykDcHwiByADKQOwAXwiCSADKQPwAXwiCiADKQPAAnwiC0IziCAKIAtWrSADQcgCaikDACAJIApWrSADQfgBaikDACAHIAlWrSADQbgBaikDACAEIAdWrSADQThqKQMAIANB+ABqKQMAfHx8fHx8fHxCDYaEfCIMQjOIIAYgDFatIAYgGFStIANBiANqKQMAIBcgGFatIANBuAJqKQMAIBYgF1atIANBqAFqKQMAIAggFlatIANB6ABqKQMAIANBKGopAwB8fHx8fHx8fHxCDYaEfCIGQjOIIAYgFVStIBQgFVatIANB+AJqKQMAIBMgFFatIANB6AFqKQMAIBIgE1atIANBqAJqKQMAIAUgElatIANB2ABqKQMAIANBGGopAwB8fHx8fHx8fHxCDYaEfCIIQv////////8DgzcDGCACIAMpA8ABIgQgAykDgAF8IgcgAykDgAJ8IgkgAykDQHwiCiADKQPQAnwiBSAIIBFUrSAQIBFWrSADQegCaikDACAPIBBWrSADQZgBaikDACAOIA9WrSADQZgCaikDACANIA5WrSADQdgBaikDACADQQhqKQMAfHx8fHx8fHx8Qg2GIAhCM4iEfCIIQv////////8DgzcDICACIAUgCFatIAUgClStIANB2AJqKQMAIAkgClatIANByABqKQMAIAcgCVatIANBiAJqKQMAIAQgB1atIANByAFqKQMAIANBiAFqKQMAfHx8fHx8fHx8Qg2GIAhCM4iEQhN+IAtC/////////wODfCIEQv////////8DgzcDACACIAxC/////////wODIARCM4h8IgRC/////////wODNwMIIAIgBkL/////////A4MgBEIziHw3AxAgA0GQA2okACABQdAAaiQACz8BAn8jACIEQYAIa0FAcSIDJAAgASABKQMwQgF8NwMwIAAgAiABEAMgAyACIAAQAyAAIANBgAgQgQEaIAQkAAs/ACACIANPBEAgACADNgIEIAAgATYCACAAQQxqIAIgA2s2AgAgACABIANqNgIIDwtBlILAAEEjQbyEwAAQRAALPgEBfyMAQRBrIgUkACAFQQhqIAFBwAAgAiADIAQQRyAFKAIMIQEgACAFKAIINgIAIAAgATYCBCAFQRBqJAALPgEBfyMAQRBrIgUkACAFQQhqIAIgAyABQcAAIAQQSSAFKAIMIQEgACAFKAIINgIAIAAgATYCBCAFQRBqJAALQQEBfyMAQRBrIgQkACAEQQhqIAIgAyABQYABQYCfwAAQSSAEKAIMIQEgACAEKAIINgIAIAAgATYCBCAEQRBqJAALQQEBfyMAQRBrIgIkACACQQhqIAFBICABKAIgQZyNwAAQZyACKAIMIQEgACACKAIINgIAIAAgATYCBCACQRBqJAALPQEBfyMAQRBrIgUkACAFQQhqQQAgAyABIAIgBBBJIAUoAgwhASAAIAUoAgg2AgAgACABNgIEIAVBEGokAAs5AQF/IwBBkANrIgMkACADEDogAyABIAIQHiADQcgBaiIBIANByAEQgQEaIAAgARAYIANBkANqJAALPwEBfyMAQRBrIgMkACADQQhqIAFBgAEgAkHAn8AAEFIgAygCDCEBIAAgAygCCDYCACAAIAE2AgQgA0EQaiQACxsBAX8jAEEQayICJAAgACABNwAAIAJBEGokAAs5AAJAAn8gAkGAgMQARwRAQQEgACACIAEoAhARAQANARoLIAMNAUEACw8LIAAgA0EAIAEoAgwRAAALPwEBfyMAQRBrIgMkACADQQhqIAFByAEgAkGEusAAEF4gAygCDCEBIAAgAygCCDYCACAAIAE2AgQgA0EQaiQACzIBAn8DQCACQYAIRkUEQCAAIAJqIgMgAykDACABIAJqKQMAhTcDACACQQhqIQIMAQsLC7IBAQF/IwBBIGsiAiQAIAJBAToAGCACIAE2AhQgAiAANgIQIAJB+I7AADYCDCACQci4wAA2AggjAEEQayIAJAAgAkEIaiIBKAIIIgJFBEBByLjAAEErQZC5wAAQRAALIAAgASgCDDYCCCAAIAE2AgQgACACNgIAIAAoAgAiAUEUaigCACECAkACQCABQQxqKAIADgIAAAELIAINACAAKAIELQAQEEEACyAAKAIELQAQEEEACzMBAX8jAEFAaiICJAAgABBFIAIQRSABIAFByABqIAIQHyAAIAJBwAAQgQEaIAJBQGskAAswAQF/IAFBAnQiAgRAIAAgAUEDdCIBIAAgAUsbIAJuDwtBoIXAAEEZQdSJwAAQRAALMgACQCAAQfz///8HSw0AIABFBEBBBA8LIAAgAEH9////B0lBAnQQIiIARQ0AIAAPCwALLgAgACADIAKtQv8Bg30gBH0iA0L/////////A4M3AwAgAUEAIANCM4inazoAAAsnACACIANJBEAgAyACIAQQeAALIAAgAiADazYCBCAAIAEgA2o2AgALIwEBfwNAIAFBwABHBEAgACABakEAOgAAIAFBAWohAQwBCwsLLAEBfyABIAIgAyAEIAUQFyEGIAMgBBBtIAEgAhBtIABBIDYCBCAAIAY2AgALJgEBfyMAQRBrIgIkACACIAE2AgwgACACQQxqQQQQGSACQRBqJAALMAAgASgCACAALQAAQQJ0IgBBuL3AAGooAgAgAEGQvcAAaigCACABKAIEKAIMEQAACyIBAX8jAEEgayIBJAAgASAAEAwgAS0AACABQSBqJABBAXELKgAgASACrUL/AYMgA3wgBHwiA0IziDwAACAAIANC/////////wODNwMACy4AIAEoAgBBrI3AAEG5jcAAIAAoAgAtAAAiABtBDUEPIAAbIAEoAgQoAgwRAAALHgAgASADRgRAIAAgAiABEIEBGg8LIAEgAyAEEDQACyEAIAIgA0kEQCADIAIgBBB0AAsgACADNgIEIAAgATYCAAscACAAIANBACABa63CIgODIANCf4UgAoOENwMACyIBAX8jAEFAaiIBJAAgASAAQcAAEIEBIgAQXyAAQUBrJAALEQAgAEEBECIiAARAIAAPCwALGQAgASgCAEGZlMAAQREgASgCBCgCDBEAAAsZACABKAIAQaqUwABBESABKAIEKAIMEQAACw0AIAEEQCAAIAEQJwsLDgAgACABEFsgAWxBAnQLFAAgACgCACABIAAoAgQoAgwRAQALbQAgAEEoEIABIgBC/v///////wcgASkDIH03AyAgAEL+////////ByABKQMYfTcDGCAAQv7///////8HIAEpAxB9NwMQIABC/v///////wcgASkDCH03AwggAELa////////ByABKQMAfTcDAAsQACABIAAoAgAgACgCBBAHC74BAQR+IABBKBCAASIAIAEpAxggASkDECABKQMIIAEpAwAiAkIziHwiBEIziHwiBUIziHwiA0L/////////A4M3AxggACABKQMgIANCM4h8IgNC/////////wODNwMgIAAgA0IziEITfiACQv////////8Dg3wiAkL/////////A4M3AwAgACAEQv////////8DgyACQjOIfCICQv////////8DgzcDCCAAIAVC/////////wODIAJCM4h8NwMQC5kGAgx+AX8gAEEoEIABIQ4jAEHwAWsiACQAIABB4AFqIAEpAyAiBkITfiAGEDIgAEHQAWogBkImfiIFIAEpAxgiAxAyIABBwAFqIANCE34gAxAyIABBsAFqIAEpAxAiBCAFEDIgAEGgAWogA0ImfiAEEDIgAEGQAWogBCAEEDIgAEGAAWogASkDCCICIAUQMiAAQfAAaiACIANCAYYiBRAyIABB4ABqIARCAYYiBCACEDIgAEHQAGogAiACEDIgACABKQMAIgMgBkIBhhAyIABBEGogAyAFEDIgAEEgaiADIAQQMiAAQTBqIAJCAYYgAxAyIABBQGsgAyADEDIgDiAAKQNgIgsgACkD4AF8IgIgACkDEHwiAyAAKQNQIgkgACkD0AF8IgQgACkDIHwiBiAAKQPAASIMIAApA7ABfCIFIAApAzB8IgcgACkDgAEiDSAAKQOgAXwiCCAAKQNAfCIKQjOIIAggClatIABByABqKQMAIAggDVStIABBiAFqKQMAIABBqAFqKQMAfHx8fEINhoR8IghCM4ggByAIVq0gBSAHVq0gAEE4aikDACAFIAxUrSAAQcgBaikDACAAQbgBaikDAHx8fHx8Qg2GhHwiBUIziCAFIAZUrSAEIAZWrSAAQShqKQMAIAQgCVStIABB2ABqKQMAIABB2AFqKQMAfHx8fHxCDYaEfCIEQv////////8DgzcDGCAOIAApA3AiCSAAKQOQAXwiBiAAKQMAfCIHIAMgBFatIAIgA1atIABBGGopAwAgAiALVK0gAEHoAGopAwAgAEHoAWopAwB8fHx8fEINhiAEQjOIhHwiAkL/////////A4M3AyAgDiACIAdUrSAGIAdWrSAAQQhqKQMAIAYgCVStIABB+ABqKQMAIABBmAFqKQMAfHx8fHxCDYYgAkIziIRCE34gCkL/////////A4N8IgJC/////////wODNwMAIA4gCEL/////////A4MgAkIziHwiAkL/////////A4M3AwggDiAFQv////////8DgyACQjOIfDcDECAAQfABaiQAC3YBAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRRqQQI2AgAgA0EcakECNgIAIANBLGpBAzYCACADQeySwAA2AhAgA0EANgIIIANBAzYCJCADIANBIGo2AhggAyADQQRqNgIoIAMgAzYCICADQQhqIAIQWQALdgEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBFGpBAjYCACADQRxqQQI2AgAgA0EsakEDNgIAIANBoJPAADYCECADQQA2AgggA0EDNgIkIAMgA0EgajYCGCADIANBBGo2AiggAyADNgIgIANBCGogAhBZAAtDAQR/QSghAwJAA0AgAC0AACIEIAEtAAAiBUYEQCAAQQFqIQAgAUEBaiEBIANBAWsiAw0BDAILCyAEIAVrIQILIAJFCwsAIAAgARBbQQJ0C3YBAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRRqQQI2AgAgA0EcakECNgIAIANBLGpBAzYCACADQcySwAA2AhAgA0EANgIIIANBAzYCJCADIANBIGo2AhggAyADQQRqNgIoIAMgAzYCICADQQhqIAIQWQALQAAgACgCACEAIAJBB3QhAgNAIAIEQCAAIAApA0BCgAF8NwNAIAAgAUIAEAAgAkGAAWshAiABQYABaiEBDAELCwsOACAAKAIAGgNADAALAAsNACAAKAIAIAEgAhAQCw4AIAAQCSAAQQA2AsgBCwsAIAAjAGokACMACw0AIAFB5JHAAEECEAcLlAUBB38CQAJAAn8CQCACIgMgACABa0sEQCABIANqIQUgACADaiECIANBD0sNASAADAILIANBD00EQCAAIQIMAwsgAEEAIABrQQNxIgVqIQQgBQRAIAAhAiABIQADQCACIAAtAAA6AAAgAEEBaiEAIAJBAWoiAiAESQ0ACwsgBCADIAVrIgNBfHEiBmohAgJAIAEgBWoiBUEDcSIABEAgBkEATA0BIAVBfHEiB0EEaiEBQQAgAEEDdCIIa0EYcSEJIAcoAgAhAANAIAQgACAIdiABKAIAIgAgCXRyNgIAIAFBBGohASAEQQRqIgQgAkkNAAsMAQsgBkEATA0AIAUhAQNAIAQgASgCADYCACABQQRqIQEgBEEEaiIEIAJJDQALCyADQQNxIQMgBSAGaiEBDAILIAJBfHEhAEEAIAJBA3EiBmshByAGBEAgASADakEBayEEA0AgAkEBayICIAQtAAA6AAAgBEEBayEEIAAgAkkNAAsLIAAgAyAGayIGQXxxIgNrIQJBACADayEDAkAgBSAHaiIFQQNxIgQEQCADQQBODQEgBUF8cSIHQQRrIQFBACAEQQN0IghrQRhxIQkgBygCACEEA0AgAEEEayIAIAQgCXQgASgCACIEIAh2cjYCACABQQRrIQEgACACSw0ACwwBCyADQQBODQAgASAGakEEayEBA0AgAEEEayIAIAEoAgA2AgAgAUEEayEBIAAgAksNAAsLIAZBA3EiAEUNAiADIAVqIQUgAiAAawshACAFQQFrIQEDQCACQQFrIgIgAS0AADoAACABQQFrIQEgACACSQ0ACwwBCyADRQ0AIAIgA2ohAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIABJDQALCwufAQEDfwJAIAEiAkEPTQRAIAAhAQwBCyAAQQAgAGtBA3EiBGohAyAEBEAgACEBA0AgAUEAOgAAIAFBAWoiASADSQ0ACwsgAyACIARrIgJBfHEiBGohASAEQQBKBEADQCADQQA2AgAgA0EEaiIDIAFJDQALCyACQQNxIQILIAIEQCABIAJqIQIDQCABQQA6AAAgAUEBaiIBIAJJDQALCyAAC7MCAQd/AkAgAiIEQQ9NBEAgACECDAELIABBACAAa0EDcSIDaiEFIAMEQCAAIQIgASEGA0AgAiAGLQAAOgAAIAZBAWohBiACQQFqIgIgBUkNAAsLIAUgBCADayIIQXxxIgdqIQICQCABIANqIgNBA3EiBARAIAdBAEwNASADQXxxIgZBBGohAUEAIARBA3QiCWtBGHEhBCAGKAIAIQYDQCAFIAYgCXYgASgCACIGIAR0cjYCACABQQRqIQEgBUEEaiIFIAJJDQALDAELIAdBAEwNACADIQEDQCAFIAEoAgA2AgAgAUEEaiEBIAVBBGoiBSACSQ0ACwsgCEEDcSEEIAMgB2ohAQsgBARAIAIgBGohAwNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANJDQALCyAAC0wAAkACQAJAIAEOAgABAgtBAEEAQYyXwAAQMwALQQFBAUGcl8AAEDMACyABQQJNBEBBAkECQayXwAAQMwALIAAzAAAgADEAAkIQhoQLWQACQAJAAkAgAQ4CAAECC0EAQQBBzJbAABAzAAtBAUEBQdyWwAAQMwALAkAgAUECSwRAIAFBA0cNAUEDQQNB/JbAABAzAAtBAkECQeyWwAAQMwALIAA1AAALDQBCrrfwl5Dx1ZqxfwsDAAELC9E9BABBgIDAAAvBFFAQEABpAAAAWwEAABUAAABQEBAAaQAAAFwBAAATAAAAUBAQAGkAAABqAQAAIAAAAAcAAAABAAAAAQAAAAgAAAAHAAAAAQAAAAEAAAAJAAAAc3JjL2xpYi5ycwAAUAAQAAoAAAARAAAALQAAAFAAEAAKAAAAGQAAADkAAABQABAACgAAACEAAAA5AAAAUAAQAAoAAAAiAAAANwAAAFZlZ2FfU1BBTV9Qb1cAAABQABAACgAAAGMAAAA3AAAAUAAQAAoAAABpAAAACgAAAGxpYnJhcnkvYWxsb2Mvc3JjL3Jhd192ZWMucnNjYXBhY2l0eSBvdmVyZmxvdwAAAOgAEAARAAAAzAAQABwAAAAMAgAABQAAAGFzc2VydGlvbiBmYWlsZWQ6IG1pZCA8PSBzZWxmLmxlbigpL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvZGlnZXN0LTAuMTAuNi9zcmMvY29yZV9hcGkvY3RfdmFyaWFibGUucnMAAAA3ARAAbgAAAI0AAAArAAAAL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvYmxvY2stYnVmZmVyLTAuMTAuNC9zcmMvbGliLnJzALgBEABjAAAAnQAAAA0AAAC4ARAAYwAAAJ0AAAAlAAAAuAEQAGMAAACiAAAAJwAAALgBEABjAAAApAAAAA0AAAC4ARAAYwAAAKQAAAAgAAAAuAEQAGMAAACuAAAACQAAALgBEABjAAAArgAAABoAAAC4ARAAYwAAALwAAAAJAAAAAAAAAGF0dGVtcHQgdG8gZGl2aWRlIGJ5IHplcm9jaHVuayBzaXplIG11c3QgYmUgbm9uLXplcm+5AhAAGwAAAAcAAAAAAAAAAQAAAAoAAAAHAAAAAAAAAAEAAAALAAAAL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvZGlnZXN0LTAuMTAuNi9zcmMvY29yZV9hcGkvcnRfdmFyaWFibGUucnMAAPwCEABuAAAALQAAADUAAAD8AhAAbgAAAC0AAAAkAAAAL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvYXJnb24yLTAuNS4wL3NyYy9ibGFrZTJiX2xvbmcucnMAAACMAxAAZQAAADIAAAAFAAAAjAMQAGUAAAAyAAAAGgAAAIwDEABlAAAAOgAAABIAAACMAxAAZQAAAEIAAAAPAAAAjAMQAGUAAABLAAAAIQAAAGludmFsaWQgQmxha2UyYlZhciBvdXQgbGVuZ3RoAAAAjAMQAGUAAABMAAAACgAAAC9ob21lL2VtaWxiYXllcy8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby02ZjE3ZDIyYmJhMTUwMDFmL2FyZ29uMi0wLjUuMC9zcmMvcGFyYW1zLnJzAHQEEABfAAAAsgAAAAkAAAAvaG9tZS9lbWlsYmF5ZXMvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tNmYxN2QyMmJiYTE1MDAxZi9hcmdvbjItMC41LjAvc3JjL2xpYi5yc+QEEABcAAAAGgEAACgAAADkBBAAXAAAABsBAAAfAAAA5AQQAFwAAABtAQAAHQAAAOQEEABcAAAAoAEAAC4AAADkBBAAXAAAAKABAABKAAAA5AQQAFwAAACjAQAAHQAAAOQEEABcAAAApQEAAB0AAADkBBAAXAAAALoBAAAdAAAA5AQQAFwAAAC/AQAAGwAAAFZlcnNpb25JbnZhbGlkVGltZVRvb1NtYWxsVGhyZWFkc1Rvb01hbnlUaHJlYWRzVG9vRmV3U2VjcmV0VG9vTG9uZ1NhbHRUb29Mb25nU2FsdFRvb1Nob3J0UHdkVG9vTG9uZ091dHB1dFRvb0xvbmdPdXRwdXRUb29TaG9ydE1lbW9yeVRvb011Y2hNZW1vcnlUb29MaXR0bGVLZXlJZFRvb0xvbmdCNjRFbmNvZGluZ0FsZ29yaXRobUludmFsaWRBZFRvb0xvbmcAAHQEEABfAAAAHwEAAAEAAABJbnZhbGlkTGVuZ3RoSW52YWxpZEVuY29kaW5nY2FsbGVkIGBSZXN1bHQ6OnVud3JhcCgpYCBvbiBhbiBgRXJyYCB2YWx1ZQAHAAAAAAAAAAEAAAAMAAAAL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvYmxha2UyLTAuMTAuNi9zcmMvbGliLnJzAAAABAcQAF0AAAByAAAAAQAAACkAAAANAAAAAAAAAAEAAAAOAAAAaW5kZXggb3V0IG9mIGJvdW5kczogdGhlIGxlbiBpcyAgYnV0IHRoZSBpbmRleCBpcyAAAIgHEAAgAAAAqAcQABIAAAA6IAAASBwQAAAA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');

  const crate = async () => {
    await init(wasm_code);
    return exports$1
  };

  // Start loading the wasm right away and "memoize" promise
  const wasm = crate();

  string('\0');

  const name = 'sha3_24_rounds';

  const U64_MAX = 2n ** 64n - 1n;

  /**
   * @param {number} difficulty
   * @param {string} blockHash
   * @param {string} tid
   * @param {bigint} [startNonce=0n]
   */
  async function solve$1 (difficulty, blockHash, tid, startNonce = 0n, endNonce = U64_MAX) {
    const crate = await wasm;

    assert$1(difficulty <= 50 && difficulty > 0);
    assert$1(typeof blockHash === 'string', 'blockHash must be hex string');
    assert$1(blockHash.length === 64, 'blockHash must be 64 hex chars');
    assert$1(typeof tid === 'string', 'tid must be hex string');
    assert$1(tid.length === 64, 'tid must be 64 hex chars');
    assert$1(typeof startNonce === 'bigint', 'startNonce must be bigint');
    assert$1(startNonce >= 0, 'startNonce must be positive');
    assert$1(startNonce <= U64_MAX, 'startNonce must be U64');

    return crate.sha3r24_pow_solve(difficulty, string(blockHash), string(tid), startNonce, endNonce)
  }

  /**
   * @param {number} difficulty
   * @param {string} blockHash
   * @param {string} tid
   * @param {bigint} [startNonce=0n]
   * @param {bigint} [endNonce=U64_MAX]
   */
  async function solve (difficulty, blockHash, tid, startNonce = undefined, endNonce = undefined) {
    return {
      nonce: await solve$1(difficulty, blockHash, tid, startNonce, endNonce),
      tid,
      hashFunction: name
    }
  }

  function inprocess() {
    return async function(args) {
      return solve(args.difficulty, args.blockHash, args.tid)
    }
  }

  const Errors = {
    JSONRPC_PARSE_ERROR: { code: -32700, message: 'Parse error' },
    JSONRPC_INVALID_REQUEST: { code: -32600, message: 'Invalid request' },
    JSONRPC_INTERNAL_ERROR: { code: -32603, message: 'Internal error' },
    JSONRPC_METHOD_NOT_FOUND: { code: -32601, message: 'Method not found' }
  };

  class JSONRPCServer {
    static Error = JSONRPCError

    constructor ({ methods, onnotification = (method, params, context) => { }, onerror = (ex, req, context) => { } }) {
      this.onerror = onerror;
      this.onnotification = onnotification;
      this._dispatch = new Map(Object.entries(methods));

      this._notificationListeners = new Set();
    }

    notify (method, params) {
      const msg = {
        jsonrpc: '2.0',
        method,
        params
      };

      for (const listener of this._notificationListeners) {
        try {
          listener(msg);
        } catch (_) { }
      }
    }

    listenNotifications (listener) {
      this._notificationListeners.add(listener);

      return () => this._notificationListeners.delete(listener)
    }

    async onrequest (req, context) {
      // Will match Arrays also but those will be caught below
      if (req == null || typeof req !== 'object') return { jsonrpc: '2.0', error: Errors.JSONRPC_PARSE_ERROR }

      if (isNotification(req)) return this.onnotification(req.method, req.params, context)

      // Ignore responses
      if (isResponse(req)) return

      if (!isRequest(req)) {
        return {
          jsonrpc: '2.0',
          error: Errors.JSONRPC_INVALID_REQUEST,
          id: req.id
        }
      }

      const method = this._dispatch.get(req.method);
      if (method == null) {
        return {
          jsonrpc: '2.0',
          error: Errors.JSONRPC_METHOD_NOT_FOUND,
          id: req.id
        }
      }

      try {
        return {
          jsonrpc: '2.0',
          id: req.id,
          result: await method(req.params, context)
        }
      } catch (ex) {
        if (ex instanceof JSONRPCServer.Error) return { jsonrpc: '2.0', error: ex.toJSON(), id: req.id }

        this.onerror(ex, req, context);
        return {
          jsonrpc: '2.0',
          error: Errors.JSONRPC_INTERNAL_ERROR,
          id: req.id
        }
      }
    }
  }

  /* istanbul ignore next */
  const solver = (async () => {
    const pow = await initWorkers() || inprocess();

    return pow
  })();

  /* istanbul ignore next */
  const server = new JSONRPCServer({
    methods: {
      async solve(args) {
        const pow = await solver;

        const s = await pow(args);

        s.nonce = s.nonce.toString();

        return s
      }
    }
  });

  /* istanbul ignore next */
  chrome.runtime.onMessage.addListener(async function listener(message, sender) {
    // ensure sender.id is the same as this extension id
    if (sender.id !== chrome.runtime.id) return
    if (message.target !== 'offscreen') return

    const res = await server.onrequest(message.data);

    chrome.runtime.sendMessage({
      target: 'offscreen',
      data: res
    });
  });

})();
