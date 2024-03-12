(function () {
	'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var nanoassert = assert$q;

	class AssertionError extends Error {}
	AssertionError.prototype.name = 'AssertionError';

	/**
	 * Minimal assert function
	 * @param  {any} t Value to check if falsy
	 * @param  {string=} m Optional assertion error message
	 * @throws {AssertionError}
	 */
	function assert$q (t, m) {
	  if (!t) {
	    var err = new AssertionError(m);
	    if (Error.captureStackTrace) Error.captureStackTrace(err, assert$q);
	    throw err
	  }
	}

	var assert$r = /*@__PURE__*/getDefaultExportFromCjs(nanoassert);

	const enc$1 = new TextEncoder();

	/**
	 * Convert a string to Uint8Array
	 * @param  {string | Uint8Array} any
	 * @return {Uint8Array}
	 */
	function string$1E (any) {
	  if (any instanceof Uint8Array) return any
	  return enc$1.encode(any)
	}

	/**
	 * Convert a uint8 [0, 255] to a Uint8Array
	 * @param  {number | Uint8Array} uint
	 * @return {Uint8Array}
	 */
	function u8 (uint) {
	  if (uint instanceof Uint8Array) return uint
	  return new Uint8Array([uint])
	}

	/**
	 * Convert a u32 [0, 0xffffffff] to a Uint8Array in Big Endian encoding
	 * @param  {number | Uint8Array} uint
	 * @return {Uint8Array}
	 */
	function u32be (uint) {
	  if (uint instanceof Uint8Array) return uint
	  const ta = new Uint8Array(4);
	  new DataView(ta.buffer).setUint32(0, uint, false);
	  return ta
	}

	/**
	 * Concatenate a number of Uint8Arrays to a single Uint8Array
	 * @param  {Uint8Array[]} uints
	 * @return {Uint8Array}
	 */
	function concat (...uints) {
	  if (uints.length === 1) return uints[0]
	  const totalLength = uints.reduce((s, a) => s + a.byteLength, 0);
	  const con = new Uint8Array(totalLength);

	  let i = 0;
	  for (const chunk of uints) {
	    con.set(chunk, i);
	    i += chunk.byteLength;
	  }

	  return con
	}

	/**
	 * Encode Uint8Array as hex string
	 * @param  {Uint8Array} buf
	 * @return {string}
	 */
	function toHex (buf) {
	  return Array.from(buf, b => b.toString(16).padStart(2, '0')).join('')
	}

	/**
	 * Decode hex string to Uint8Array
	 * @param  {string} str
	 * @return {Uint8Array}
	 */
	function hex (str) {
	  const buf = new Uint8Array(str.length / 2);
	  for (let i = 0; i < str.length; i += 2) {
	    buf[i / 2] = parseInt(str.slice(i, i + 2), 16);
	  }
	  return buf
	}

	const dec$1 = new TextDecoder();

	/**
	 * Decode Uint8Array as string
	 * @param  {Uint8Array} buf
	 * @return {string}
	 */
	function toString (buf) {
	  return dec$1.decode(buf)
	}

	// Modified from the b64 encoder emitted by wasmbindgen
	const b64Lookup = [62, 0, 0, 0, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 0, 0, 0, 0, 0, 0, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
	const asciiLookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	function getBase64Code$1 (charCode) {
	  return b64Lookup[charCode - 43]
	}

	/**
	 * Decode a base64 string to Uint8Array
	 * @param  {string} str
	 * @return {Uint8Array}
	 */
	function base64 (str) {
	  const missingOctets = str.endsWith('==') ? 2 : str.endsWith('=') ? 1 : 0;
	  const n = str.length;
	  const result = new Uint8Array(3 * (n / 4));
	  let buffer;

	  for (let i = 0, j = 0; i < n; i += 4, j += 3) {
	    buffer =
	      getBase64Code$1(str.charCodeAt(i)) << 18 |
	      getBase64Code$1(str.charCodeAt(i + 1)) << 12 |
	      getBase64Code$1(str.charCodeAt(i + 2)) << 6 |
	      getBase64Code$1(str.charCodeAt(i + 3));
	    result[j] = buffer >> 16;
	    result[j + 1] = (buffer >> 8) & 0xFF;
	    result[j + 2] = buffer & 0xFF;
	  }

	  return result.subarray(0, result.length - missingOctets)
	}

	/**
	 * Encode a Uint8Array to base64 string
	 * @param  {Uint8Array} buf
	 * @return {string}
	 */
	function toBase64 (buf) {
	  let result = ''; let i; const l = buf.length;
	  for (i = 2; i < l; i += 3) {
	    result += asciiLookup[buf[i - 2] >> 2];
	    result += asciiLookup[((buf[i - 2] & 0x03) << 4) | (buf[i - 1] >> 4)];
	    result += asciiLookup[((buf[i - 1] & 0x0F) << 2) | (buf[i] >> 6)];
	    result += asciiLookup[buf[i] & 0x3F];
	  }
	  if (i === l + 1) { // 1 octet yet to write
	    result += asciiLookup[buf[i - 2] >> 2];
	    result += asciiLookup[(buf[i - 2] & 0x03) << 4];
	    result += '==';
	  }
	  if (i === l) { // 2 octets yet to write
	    result += asciiLookup[buf[i - 2] >> 2];
	    result += asciiLookup[((buf[i - 2] & 0x03) << 4) | (buf[i - 1] >> 4)];
	    result += asciiLookup[(buf[i - 1] & 0x0F) << 2];
	    result += '=';
	  }
	  return result
	}

	const DEFAULT_TIMEOUT = 15000;

	class NodeRPC {
	  /**
	   *
	   * @param {URL[]} nodeUrls
	   */
	  constructor(nodeUrl, timeout = DEFAULT_TIMEOUT) {
	    assert$r(nodeUrl instanceof URL, 'nodeUrl must be WHATWG URLs');

	    this._url = nodeUrl;
	    this._timeout = timeout;
	  }

	  /**
	   * Make direct GET request to data node
	   *
	   * @param {string} url - path part of the URL
	   *
	   * @returns {Promise<Object>}
	   * @throws {Error} if response status is not 2xx
	   * @throws {Error} if response body is not JSON
	   */
	  async getJSON(url) {
	    const _url = new URL(url, this._url);

	    const res = await fetch(_url, {
	      headers: {
	        Accept: 'application/json'
	      },
	      signal: AbortSignal.timeout(this._timeout)
	    });

	    if (!res.ok) {
	      throw new Error(`HTTP ${res.status} ${res.statusText}`)
	    }

	    return res.json()
	  }

	  /**
	   * Make direct POST request to data node
	   *
	   * @param {string} url - path part of the URL
	   *
	   * @returns {Promise<Object>}
	   * @throws {Error} if response status is not 2xx
	   * @throws {Error} if response body is not JSON
	   */
	  async postJSON(url, body) {
	    const _url = new URL(url, this._url);

	    const res = await fetch(_url, {
	      method: 'POST',
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify(body),
	      signal: AbortSignal.timeout(this._timeout)
	    });

	    if (!res.ok) {
	      throw new Error(`HTTP ${res.status} ${res.statusText}`)
	    }

	    return res.json()
	  }

	  /**
	   * Find a healthy Vega node. Algorithm:
	   * 1. Request `/blockchain/height` from all nodes
	   * 2. Remove nodes that:
	   *  - Don't reply
	   *  - Return a HTTP status code outside 2xx
	   *  - Have a difference between their core block height and data node block height larger than `maxDrift`
	   *  - Are `maxDelay` ms slower than the fastest node
	   * 3. Group nodes into buckets of 3 blocks within each other
	   * 4. Pick a random node from the largest bucket
	   *
	   * @returns URL
	   */
	  static async findHealthyNode(urls, maxDrift = 2, bucketSize = 3, maxDelay = 800) {
	    const timeout = new AbortController();
	    const nodesHeights = await promiseAllResolved(
	      urls.map(async (u) => {
	        const res = await fetch(new URL('/blockchain/height', u), {
	          signal: timeout.signal,
	          headers: {
	            Accept: 'application/json'
	          }
	        });

	        if (res.ok === false) throw new Error('Failed request')

	        const { height } = await res.json();

	        const coreHeight = BigInt(height);
	        // The header is not set for talking to core nodes
	        const nodeHeight = BigInt(res.headers.get('x-block-height') ?? coreHeight);

	        const drift = coreHeight - nodeHeight;
	        // eslint-disable-next-line yoda
	        if (-maxDrift > drift || drift > maxDrift) throw new Error('Block drift too high')

	        return [u, nodeHeight]
	      })
	    );

	    const maxHeight = nodesHeights.reduce((m, [_, height]) => bigintMax(m, height), 0n);

	    const groups = group(nodesHeights, ([node, height]) => {
	      const key = (maxHeight - height) / BigInt(bucketSize); // Group into buckets
	      return [key, node]
	    });

	    const largestGroup = findLargest(groups);

	    if (largestGroup.length === 0) throw new Error('No healthy node found')

	    return new this(pickRandom(largestGroup))

	    // Math.max does not work with bigint
	    /**
	     *
	     * @param {bigint} a
	     * @param {bigint} b
	     * @returns bigint
	     */
	    function bigintMax(a, b) {
	      return a > b ? a : b
	    }

	    async function promiseAllResolved(promises) {
	      const timers = [];

	      // Add a max default timeout
	      timers.push(
	        setTimeout(() => {
	          timeout.abort();
	        }, DEFAULT_TIMEOUT)
	      );

	      promises.forEach((p) => {
	        p.then(
	          (res) => {
	            timers.push(
	              setTimeout(() => {
	                timeout.abort();
	              }, maxDelay)
	            );
	          },
	          () => {}
	        );
	      });

	      return Promise.allSettled(promises).then((results) => {
	        timers.forEach((t) => clearTimeout(t));
	        return results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value)
	      })
	    }

	    function group(values, fn) {
	      const groups = values.reduce((map, val) => {
	        const [key, value] = fn(val);

	        const list = map.get(key) ?? [];
	        list.push(value);
	        map.set(key, list);

	        return map
	      }, new Map());

	      return Array.from(groups.values())
	    }

	    function findLargest(arr) {
	      return arr.reduce((largest, group) => (group.length > largest.length ? group : largest), [])
	    }

	    function pickRandom(arr) {
	      return arr[(arr.length * Math.random()) | 0]
	    }
	  }

	  async blockchainHeight() {
	    return this.getJSON('/blockchain/height')
	  }

	  async statistics() {
	    return this.getJSON('/statistics')
	  }

	  /**
	   *
	   * @param {{ partyId: string }} param0
	   * @returns
	   */
	  async statisticsSpam({ partyId }) {
	    assert$r(typeof partyId === 'string');
	    return this.getJSON(`/statistics/spam/${partyId}`)
	  }

	  async checkRawTransaction(tx) {
	    const res = await this.postJSON('/transaction/raw/check', { tx });

	    return res
	  }

	  async submitRawTransaction(tx, type) {
	    assert$r(typeof tx === 'string');
	    assert$r(typeof type === 'string');

	    const res = await this.postJSON('/transaction/raw', {
	      tx,
	      type
	    });

	    // Error codes from https://github.com/vegaprotocol/vega/blob/develop/core/blockchain/response.go
	    switch (res.code) {
	      case 0:
	        return res

	      case 51:
	        throw new NodeRPC.TxErrors.AbciTxnValidationFailure(toString(hex(res.data)), res.code)

	      // AbciTxnDecodingFailure code is returned when CheckTx or DeliverTx fail to decode the Txn.
	      case 60:
	        throw new NodeRPC.TxErrors.AbciTxnDecodingFailure(toString(hex(res.data)), res.code)

	      // AbciTxnInternalError code is returned when CheckTx or DeliverTx fail to process the Txn.
	      case 70:
	        throw new NodeRPC.TxErrors.AbciTxnInternalError(toString(hex(res.data)), res.code)

	      // AbciUnknownCommandError code is returned when the app doesn't know how to handle a given command.
	      case 80:
	        throw new NodeRPC.TxErrors.AbciUnknownCommandError(toString(hex(res.data)), res.code)

	      // AbciSpamError code is returned when CheckTx or DeliverTx fail spam protection tests.
	      case 89:
	        throw new NodeRPC.TxErrors.AbciSpamError(toString(hex(res.data)), res.code)
	    }
	  }

	  static isTxError(err) {
	    return (
	      err instanceof NodeRPC.TxErrors.AbciTxnValidationFailure ||
	      err instanceof NodeRPC.TxErrors.AbciTxnDecodingFailure ||
	      err instanceof NodeRPC.TxErrors.AbciTxnInternalError ||
	      err instanceof NodeRPC.TxErrors.AbciUnknownCommandError ||
	      err instanceof NodeRPC.TxErrors.AbciSpamError
	    )
	  }

	  static TxErrors = {
	    AbciTxnValidationFailure: class extends Error {
	      constructor(msg, code) {
	        super(msg);
	        this.code = code;
	      }
	    },
	    AbciTxnDecodingFailure: class extends Error {
	      constructor(msg, code) {
	        super(msg);
	        this.code = code;
	      }
	    },
	    AbciTxnInternalError: class extends Error {
	      constructor(msg, code) {
	        super(msg);
	        this.code = code;
	      }
	    },
	    AbciUnknownCommandError: class extends Error {
	      constructor(msg, code) {
	        super(msg);
	        this.code = code;
	      }
	    },
	    AbciSpamError: class extends Error {
	      constructor(msg, code) {
	        super(msg);
	        this.code = code;
	      }
	    }
	  }
	}

	class NetworkCollection {
	  constructor(store) {
	    this.store = store;

	    // Cache of live Network instances
	    this._cache = new Map();
	  }

	  /**
	   *
	   * @param {string} name
	   * @param {{name: string, rest: string[], explorer: string}} config
	   * @returns {Promise<Network>}
	   */
	  async set(name, config) {
	    assert$r(typeof config.name === 'string');
	    assert$r(Array.isArray(config.rest));

	    // validate
	    await this.store.set(name, config);

	    this._cache.delete(name);
	    const net = new Network(config);
	    this._cache.set(name, net);

	    return net
	  }

	  async getByChainId(chainId) {
	    const nets = await this.listNetworkDetails();
	    return nets.find((net) => net.chainId === chainId)
	  }

	  getByNetworkId(networkId) {
	    if (this._cache.has(networkId)) return this._cache.get(networkId)

	    return this.store.get(networkId)
	  }

	  /**
	   * Get a network by networkId, with a fallback to chainId
	   *
	   * @param {string} networkId - The preferred network configuration id
	   * @param {string} chainId - The preferred chain id (fallback)
	   * @returns {Promise<Network>}
	   */
	  async get(networkId, chainId) {
	    if (this._cache.has(networkId)) return this._cache.get(networkId)

	    const candidate = (await this.getByNetworkId(networkId)) ?? (await this.getByChainId(chainId));

	    if (candidate == null) throw new Error(`No network found for networkId ${networkId} or chainId ${chainId}`)

	    const net = new Network(candidate);
	    this._cache.set(networkId, net);
	    return net
	  }

	  /**
	   *
	   * @param {string} name
	   * @returns {Promise<boolean>}
	   */
	  async delete(name) {
	    this._cache.delete(name);
	    return this.store.delete(name)
	  }

	  /**
	   *
	   * @returns {Promise<string[]>}
	   */
	  async list() {
	    return Array.from(await this.store.keys())
	  }

	  /**
	   *
	   * @returns {Promise<Network[]>}
	   */
	  async listNetworkDetails() {
	    const networks = await this.list();
	    const promises = networks.map(async (k) => {
	      const network = await this.get(k);
	      const sanitizedNetwork = {
	        ...network,
	        // Firefox cannot clone promises/url objects like this to send over the port
	        preferredNode: await network.preferredNode?.toString()
	      };
	      return {
	        ...sanitizedNetwork,
	        id: k
	      }
	    });
	    return Promise.all(promises)
	  }
	}

	const DEFAULT_PREFERRED_NODE_TTL = 1000 * 5; // 5 seconds

	class Network {
	  constructor({
	    id,
	    name,
	    chainId,
	    hidden,
	    rest,
	    console,
	    ethereumExplorerLink,
	    explorer,
	    governance,
	    docs,
	    vegaDapps,
	    color,
	    secondaryColor
	  }) {
	    this.id = id;
	    this.name = name;
	    this.chainId = chainId;
	    this.hidden = hidden;
	    this.rest = rest;
	    this.console = console;
	    this.ethereumExplorerLink = ethereumExplorerLink;
	    this.explorer = explorer;
	    this.governance = governance;
	    this.docs = docs;
	    this.vegaDapps = vegaDapps;
	    this.color = color;
	    this.secondaryColor = secondaryColor;

	    this.probing = false;
	    this.preferredNode = null;

	    this._nodeTimeout = null;
	  }

	  async rpc() {
	    // Note that no awaits are present on `this.preferredNode` inside here.
	    // This prevents any errors inside the perferred node from being thrown here,
	    // but instead in the caller that unwraps the promise.

	    // If we're already probing, return the preferred node promise
	    if (this.probing === true) return this.preferredNode
	    // If we have a preferred node, return it
	    if (this.preferredNode != null) return this.preferredNode

	    // Clear timeout just to be safe. This should not have any effect currently,
	    // but we may change the logic to take into account failed requests to the preferred node
	    clearTimeout(this._nodeTimeout);
	    this.probing = true;

	    this.preferredNode = NodeRPC.findHealthyNode(this.rest.map((u) => new URL(u)))
	      .then(
	        (node) => {
	          // Only set timeout if successful
	          this._nodeTimeout = setTimeout(() => {
	            this.preferredNode = null;
	          }, DEFAULT_PREFERRED_NODE_TTL);

	          return node
	        },
	        (err) => {
	          // The promise will reject all pending calls, but clear state
	          // such that the next call will try to find a healthy node again
	          this.preferredNode = null;
	          throw err
	        }
	      )
	      .finally(() => {
	        this.probing = false;
	      });

	    return this.preferredNode
	  }
	}

	const crypto = globalThis.crypto;
	const subtle = crypto.subtle;

	/**
	 * @param {Uint8Array} buf
	 */
	function randomFill (buf) {
	  assert$r(
	    buf.byteLength < 2 ** 16,
	    'A maximum of 2**16-1 bytes can be fulfilled'
	  );
	  crypto.getRandomValues(buf);

	  return buf
	}

	/**
	 * @async
	 * @param  {Uint8Array} password
	 * @param  {Uint8Array} salt
	 * @param  {number} iterations
	 * @param  {number} bytes
	 * @return {Promise<Uint8Array>}
	 */
	async function pbkdf2Sha512 (password, salt, iterations, bytes) {
	  assert$r(password instanceof Uint8Array);
	  assert$r(salt instanceof Uint8Array);
	  assert$r(iterations > 0 && iterations <= 2 ** 53);
	  assert$r(bytes > 0 && bytes <= 64);

	  const _password = await subtle.importKey(
	    'raw',
	    password,
	    { name: 'PBKDF2' },
	    false,
	    ['deriveKey']
	  );

	  const key = await subtle.deriveKey(
	    {
	      name: 'PBKDF2',
	      salt,
	      iterations,
	      hash: 'SHA-512'
	    },
	    _password,
	    { name: 'HMAC', hash: 'SHA-512', length: bytes * 8 },
	    true,
	    ['sign', 'verify']
	  );

	  return new Uint8Array(await subtle.exportKey('raw', key))
	}

	/**
	 * @async
	 * @param  {Uint8Array} key
	 * @param  {Uint8Array} data
	 * @return {Promise<Uint8Array>}
	 */
	async function hmacSha512 (key, data) {
	  assert$r(key instanceof Uint8Array);
	  assert$r(data instanceof Uint8Array);

	  const _key = await subtle.importKey(
	    'raw',
	    key,
	    { name: 'HMAC', hash: 'SHA-512' },
	    false,
	    ['sign']
	  );

	  return new Uint8Array(
	    await subtle.sign({ name: 'HMAC', hash: 'SHA-512' }, _key, data)
	  )
	}

	/**
	 * @async
	 * @param {Uint8Array} data
	 * @returns {Promise<Uint8Array>}
	 */
	async function sha256 (data) {
	  return new Uint8Array(await subtle.digest('SHA-256', data))
	}

	async function aes256gcmEncrypt (key, iv, plaintext, aad) {
	  assert$r(key instanceof Uint8Array);
	  assert$r(iv instanceof Uint8Array);
	  assert$r(plaintext instanceof Uint8Array);
	  assert$r(aad instanceof Uint8Array);

	  const _key = await subtle.importKey('raw', key, 'AES-GCM', false, [
	    'encrypt'
	  ]);

	  return new Uint8Array(
	    await subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad }, _key, plaintext)
	  )
	}

	async function aes256gcmDecrypt (key, iv, ciphertext, aad) {
	  assert$r(key instanceof Uint8Array);
	  assert$r(iv instanceof Uint8Array);
	  assert$r(ciphertext instanceof Uint8Array);
	  assert$r(aad instanceof Uint8Array);

	  const _key = await subtle.importKey('raw', key, 'AES-GCM', false, [
	    'decrypt'
	  ]);

	  return new Uint8Array(
	    await subtle.decrypt({ name: 'AES-GCM', iv, additionalData: aad }, _key, ciphertext)
	  )
	}

	/** @type {Uint8Array} BIP-0039 defined salt prefix */
	const BIP39_SALT_PREFIX = string$1E('mnemonic');

	/** @type {number} BIP-0039 defined iterations for PBKDF2-SHA-512 */
	const BIP39_ITERATIONS = 2048;
	/** @type {number} BIP-0039 defined number of bytes to extract for key material */
	const BIP39_KEYBYTES = 64;

	/**
	 * Derive a new seed from a BIP-0039 mnemonic. Note that no validation is
	 * performed.
	 * @async
	 * @param  {string | Uint8Array} mnemonic - Space delimited mnemonic
	 * @param  {string | Uint8Array} [password=""] - Optional password
	 * @return {Promise<Uint8Array>} - 64-byte seed
	 */
	async function seed (mnemonic, password = '') {
	  assert$r(mnemonic instanceof Uint8Array || typeof mnemonic === 'string');
	  assert$r(password instanceof Uint8Array || typeof password === 'string');

	  const _password = string$1E(mnemonic);
	  const salt = concat(BIP39_SALT_PREFIX, string$1E(password));

	  return pbkdf2Sha512(
	    _password,
	    salt,
	    BIP39_ITERATIONS,
	    BIP39_KEYBYTES
	  )
	}

	/**
	 * SLIP-0010 Ed25519 key derivation
	 * @type {string}
	 */
	const CURVE_ED25519$1 = 'ed25519 seed';

	/**
	 * Hardended child node offset
	 * @type {number}
	 */
	const HARDENED_OFFSET = 0x8000_0000;

	/**
	 * Master key derivation
	 *
	 * @async
	 * @param  {Uint8Array} seed
	 * @param  {string} curve
	 * @return {Promise<{ secretKey: Uint8Array, chainCode: Uint8Array }>}
	 */
	async function master (seed, curve) {
	  assert$r(curve === CURVE_ED25519$1, 'Only Ed25519 is supported for now');
	  assert$r(seed instanceof Uint8Array || typeof seed === 'string');

	  const key = string$1E(curve);
	  const data = string$1E(seed);

	  const I = await hmacSha512(key, data);

	  return {
	    secretKey: I.subarray(0, 32),
	    chainCode: I.subarray(32, 64)
	  }
	}

	/**
	 * Child key derivation
	 *
	 * @async
	 * @param  {Uint8Array} parentSecretKey
	 * @param  {Uint8Array} parentChainCode
	 * @param  {number} index
	 * @return {Promise<{ secretKey: Uint8Array, chainCode: Uint8Array }>}
	 */
	async function child (parentSecretKey, parentChainCode, index) {
	  assert$r(parentSecretKey instanceof Uint8Array);
	  assert$r(parentSecretKey.byteLength === 32);
	  assert$r(parentChainCode instanceof Uint8Array);
	  assert$r(parentChainCode.byteLength === 32);
	  assert$r(index >= 0);
	  assert$r(index >= HARDENED_OFFSET, 'Ed25519 only supports hardened derivation');
	  assert$r(index < 2 ** 32);

	  const key = parentChainCode;
	  const data = concat(u8(0x00), parentSecretKey, u32be(index));
	  const I = await hmacSha512(key, data);

	  return {
	    secretKey: I.subarray(0, 32),
	    chainCode: I.subarray(32, 64)
	  }
	}

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
	  init$3.__wbindgen_wasm_module = module;
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

	async function init$3 (input) {
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
	  default: init$3,
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

	const wasm_code = base64_decode('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wAAQSSAFKAIYIAUoAhwQgwEhKiAFQRBqQRpBHSAMIAtBrKvAABBJIAUoAhAgBSgCFBCCASEyIAVBCGpBHEEgIAwgC0G8q8AAEEkgBSgCCCAFKAIMEIMBIUAgBEUNASAGIA5CAYhC////AIMiDiAPQgKIQv///wCDIg9+IBBCBIhC////AIMiECARQgeIIhF+fCAWQgaIQv///wCDIhYgEkIFiEL///8AgyISfnwgE0IDiCITIBVC////AIMiFX58IBdC////AIMiFyAUQgOIIhR+fCAZQgWIQv///wCDIhkgGEIGiEL///8AgyIYfnwgGkICiEL///8AgyIaIBtCAYhC////AIMiG358ICVCB4giJSAgQgSIQv///wCDIiB+fCAPIBB+ICRCB4hC////AIMiJCARfnwgDiASfnwgFSAWfnwgEyAUfnwgFyAYfnwgGSAbfnwgGiAgfnwgJSAfQgeIQv///wCDIh9+fCIvQoCAQH0iJ0IViHwiMCARICV+IiZCgIBAfSIoQhWIIjNC0asIfnwgMEKAgEB9IitCgICAf4N9ICYgKEKAgID/////A4N9IA8gJX4gESAafnwgDyAafiARIBl+fCASICV+fCIoQoCAQH0iLEIViHwiJkKAgEB9IjlCFYh8IjBCg6FWfnwgM0LTjEN+IC98ICdCgICAf4N9IA8gJH4gI0ICiEL///8AgyIjIBF+fCAQIBJ+fCAOIBV+fCAUIBZ+fCATIBh+fCAXIBt+fCAZICB+fCAaIB9+fCAlIB5CAohC////AIMiHn58IA8gI34gIkIFiEL///8AgyIiIBF+fCASICR+fCAQIBV+fCAOIBR+fCAWIBh+fCATIBt+fCAXICB+fCAZIB9+fCAaIB5+fCAlIB1CBYhC////AIMiHX58IkFCgIBAfSJCQhWIfCJDQoCAQH0iREIViHwgMELRqwh+fCAmIDlCgICA/////wCDfSIvQoOhVn58IjlCgIBAfSJFQhWHfCI6QoCAQH0iO0IVhyAPIBZ+IA4gEX58IBIgE358IBUgF358IBQgGX58IBggGn58IBsgJX58IicgM0KDoVZ+fCAnQoCAQH0iJkKAgIB/g30gK0IViHwiJyAnQoCAQH0iK0KAgIB/g318IidCg6FWfiAPIBN+IBEgFn58IBIgF358IBUgGX58IBQgGn58IBggJX58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IgcgBIVCMIkiBCAAQYgCaiIbKQMAIgMgAEEIaiIcKQMAIgh8IAhCAYZC/v///x+DIANC/////w+DfnwiCCAAQYgGaiIdKQMAhUIgiSILIABBiARqIh4pAwAiDHwgDEIBhkL+////H4MgC0L/////D4N+fCIMIAOFQiiJIgMgCHwgCEIBhkL+////H4MgA0L/////D4N+fCIIIAuFQjCJIgsgDHwgDEIBhkL+////H4MgC0L/////D4N+fCIMIAOFQgGJIgMgAEGAAmoiHykDACIPIAApAwAiCnwgCkIBhkL+////H4MgD0L/////D4N+fCIKIABBgAZqIiApAwCFQiCJIhAgAEGABGoiISkDACITfCATQgGGQv7///8fgyAQQv////8Pg358IhMgD4VCKIkiDyAKfCAKQgGGQv7///8fgyAPQv////8Pg358Igp8IApCAYZC/v///x+DIANC/////w+DfnwiCYVCIIkiFCAAQYADaiIiKQMAIhEgAEGAAWoiIykDACINfCANQgGGQv7///8fgyARQv////8Pg358Ig0gAEGAB2oiJCkDAIVCIIkiEiAAQYAFaiIAKQMAIg58IA5CAYZC/v///x+DIBJC/////w+DfnwiDiARhUIoiSIRIA18IA1CAYZC/v///x+DIBFC/////w+DfnwiDSAShUIwiSISIA58IA5CAYZC/v///x+DIBJC/////w+DfnwiDnwgDkIBhkL+////H4MgFEL/////D4N+fCIVIAOFQiiJIgMgCXwgCUIBhkL+////H4MgA0L/////D4N+fCIJNwMAIBkgCSAUhUIwiSIJNwMAIAAgCSAVfCAVQgGGQv7///8fgyAJQv////8Pg358Igk3AwAgGyADIAmFQgGJNwMAICAgBCAGfCAGQgGGQv7///8fgyAEQv////8Pg358IgQgDiARhUIBiSIGIAh8IAhCAYZC/v///x+DIAZC/////w+DfnwiAyAKIBCFQjCJIgiFQiCJIgp8IApCAYZC/v///x+DIARC/////w+DfnwiECAGhUIoiSIGIAN8IANCAYZC/v///x+DIAZC/////w+DfnwiCSAKhUIwiSIDNwMAIBwgCTcDACAaIAMgEHwgEEIBhkL+////H4MgA0L/////D4N+fCIDNwMAICIgAyAGhUIBiTcDACAdIAQgBYVCAYkiBSANfCANQgGGQv7///8fgyAFQv////8Pg358IgQgC4VCIIkiBiAIIBN8IBNCAYZC/v///x+DIAhC/////w+DfnwiA3wgA0IBhkL+////H4MgBkL/////D4N+fCIIIAWFQiiJIgUgBHwgBEIBhkL+////H4MgBUL/////D4N+fCILIAaFQjCJIgQ3AwAgIyALNwMAICEgBCAIfCAIQgGGQv7///8fgyAEQv////8Pg358IgQ3AwAgFyAEIAWFQgGJNwMAICQgByADIA+FQgGJIgV8IAVCAYZC/v///x+DIAdC/////w+DfnwiByAShUIgiSIEIAx8IAxCAYZC/v///x+DIARC/////w+DfnwiBiAFhUIoiSIFIAd8IAdCAYZC/v///x+DIAVC/////w+DfnwiAyAEhUIwiSIHNwMAIBggAzcDACAeIAYgB3wgBkIBhkL+////H4MgB0L/////D4N+fCIHNwMAIB8gBSAHhUIBiTcDACABQRBqIQEMAAsACwUgASACaiIAIABBOGoiFykDACIFIABBGGoiGCkDACIHfCAHQgGGQv7///8fgyAFQv////8Pg358IgcgAEH4AGoiGSkDAIVCIIkiBCAAQdgAaiIaKQMAIgZ8IAZCAYZC/v///x+DIARC/////w+DfnwiBiAFhUIoiSIFIAd8IAdCAYZC/v///x+DIAVC/////w+DfnwiByAEhUIwiSIEIABBKGoiGykDACIDIABBCGoiHCkDACIIfCAIQgGGQv7///8fgyADQv////8Pg358IgggAEHoAGoiHSkDAIVCIIkiCyAAQcgAaiIeKQMAIgx8IAxCAYZC/v///x+DIAtC/////w+DfnwiDCADhUIoiSIDIAh8IAhCAYZC/v///x+DIANC/////w+DfnwiCCALhUIwiSILIAx8IAxCAYZC/v///x+DIAtC/////w+DfnwiDCADhUIBiSIDIABBIGoiHykDACIPIAApAwAiCnwgCkIBhkL+////H4MgD0L/////D4N+fCIKIABB4ABqIiApAwCFQiCJIhAgAEFAayIhKQMAIhN8IBNCAYZC/v///x+DIBBC/////w+DfnwiEyAPhUIoiSIPIAp8IApCAYZC/v///x+DIA9C/////w+DfnwiCnwgCkIBhkL+////H4MgA0L/////D4N+fCIJhUIgiSIUIABBMGoiIikDACIRIABBEGoiIykDACINfCANQgGGQv7///8fgyARQv////8Pg358Ig0gAEHwAGoiJCkDAIVCIIkiEiAAQdAAaiIAKQMAIg58IA5CAYZC/v///x+DIBJC/////w+DfnwiDiARhUIoiSIRIA18IA1CAYZC/v///x+DIBFC/////w+DfnwiDSAShUIwiSISIA58IA5CAYZC/v///x+DIBJC/////w+DfnwiDnwgDkIBhkL+////H4MgFEL/////D4N+fCIVIAOFQiiJIgMgCXwgCUIBhkL+////H4MgA0L/////D4N+fCIJNwMAIBkgCSAUhUIwiSIJNwMAIAAgCSAVfCAVQgGGQv7///8fgyAJQv////8Pg358Igk3AwAgGyADIAmFQgGJNwMAICAgBCAGfCAGQgGGQv7///8fgyAEQv////8Pg358IgQgDiARhUIBiSIGIAh8IAhCAYZC/v///x+DIAZC/////w+DfnwiAyAKIBCFQjCJIgiFQiCJIgp8IApCAYZC/v///x+DIARC/////w+DfnwiECAGhUIoiSIGIAN8IANCAYZC/v///x+DIAZC/////w+DfnwiCSAKhUIwiSIDNwMAIBwgCTcDACAaIAMgEHwgEEIBhkL+////H4MgA0L/////D4N+fCIDNwMAICIgAyAGhUIBiTcDACAdIAQgBYVCAYkiBSANfCANQgGGQv7///8fgyAFQv////8Pg358IgQgC4VCIIkiBiAIIBN8IBNCAYZC/v///x+DIAhC/////w+DfnwiA3wgA0IBhkL+////H4MgBkL/////D4N+fCIIIAWFQiiJIgUgBHwgBEIBhkL+////H4MgBUL/////D4N+fCILIAaFQjCJIgQ3AwAgIyALNwMAICEgBCAIfCAIQgGGQv7///8fgyAEQv////8Pg358IgQ3AwAgFyAEIAWFQgGJNwMAICQgByADIA+FQgGJIgV8IAVCAYZC/v///x+DIAdC/////w+DfnwiByAShUIgiSIEIAx8IAxCAYZC/v///x+DIARC/////w+DfnwiBiAFhUIoiSIFIAd8IAdCAYZC/v///x+DIAVC/////w+DfnwiAyAEhUIwiSIHNwMAIBggAzcDACAeIAYgB3wgBkIBhkL+////H4MgB0L/////D4N+fCIHNwMAIB8gBSAHhUIBiTcD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AoQSIAcgB0GAGmo2AoASIAdBgBJqQQEgB0GgAWpBIBAOQf8BcSEPDAMLIAUgEkGwi8AAEDMACyAMQQFGDQIgBUEBaiEOIA0gDGshDSAIIBFqIQZBACEJA0AgCUECRgRAIA4hBSAGIQgMAgsgByAJNgKACiAHQQQ2ApQaIAdBBDYCjBogB0HAADYChBogByAFNgKAEiAHIAdBgBJqNgKQGiAHIAdBgApqNgKIGiAHIAdBwAFqNgKAGiAHQYAaakEDIAhBgAgQDkH/AXEiD0ESRw0CIAhBgAhqIQggCUEBaiEJDAALAAsACyAQBEAgCiAQQQp0ECcLIA9BEkcNASAHQZgaaiIIIAdBuAFqKQMANwMAIAdBkBpqIgYgB0GwAWopAwA3AwAgB0GIGmoiBSAHQagBaikDADcDACAHIAcpA6ABNwOAGkEgEGoiCkEYaiAIKQMANwAAIApBEGogBikDADcAACAKQQhqIAUpAwA3AAAgCiAHKQOAGjcAACADIAQQbSABIAIQbSAAQSA2AgQgACAKNgIAIBwkAA8LQQJBAUHQisAAEHQACyAHIA86AIAaQciNwABBKyAHQYAaakHAgMAAQbyBwAAQLwALIAdBjBpqQQE2AgAgB0GUGmpBADYCACAHQdSFwAA2AogaIAdByLjAADYCkBogB0EANgKAGiAHQYAaakHAisAAEFkACwALIwBBIGsiACQAIABBFGpBATYCACAAQRxqQQA2AgAgAEH8gcAANgIQIABByLjAADYCGCAAQQA2AgggAEEIakGEgsAAEFkACyAHIAk6AIAaQciNwABBKyAHQYAaakHAgMAAQayBwAAQLwAL3BIBHn4gAEHAABCCASESIABBAmpBBBCDASETIABBBWpBAxCCASEUIABBB2pBBBCDASEZIABBCmpBBBCDASEaIABBDWpBAxCCASEbIABBD2pBBBCDASELIABBEmpBAxCCASEIIABBFWpBAxCCASEEIABBF2pBBBCDASEBIABBGmpBAxCCASEFIABBHGpBBBCDASEcIABBH2pBBBCDASEJIABBImpBAxCCASEVIABBJGpBBBCDASEKIABBJ2pBAxCCASEOIABBKmpBAxCCASEGIABBLGpBBBCDASEMIAAgAEEvakEDEIIBQgKIQv///wCDIgJC04xDfiABQgWIQv///wCDfCAAQTFqQQQQ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dUHIuMAAcSEJIAZBCWogAmohCgJAIAEoAghFBEAgASgCACICIAFBBGooAgAiASAIIAkQVg0BIAIgCiAEIAEoAgwRAAAhAAwBCwJAAkACQAJAIAFBDGooAgAiByAEIAVqIgBLBEAgA0EIcQ0EIAcgAGsiACEDQQEgAS0AICICIAJBA0YbIgJBAWsOAgECAwtBASEAIAEoAgAiAiABQQRqKAIAIgEgCCAJEFYNBCACIAogBCABKAIMEQAAIQAMBAtBACEDIAAhAgwBCyAAQQF2IQIgAEEBakEBdiEDCyACQQFqIQIgAUEEaigCACEFIAEoAhwhByABKAIAIQECQANAIAJBAWsiAkUNASABIAcgBSgCEBEBAEUNAAtBASEADAILQQEhACAHQYCAxABGDQEgASAFIAggCRBWDQEgASAKIAQgBSgCDBEAAA0BQQAhAgJ/A0AgAyACIANGDQEaIAJBAWohAiABIAcgBSgCEBEBAEUNAAsgAkEBawsgA0khAAwBCyABKAIcIQwgAUEwNgIcIAEtACAhDUEBIQAgAUEBOgAgIAEoAgAiAyABQQRqKAIAIgsgCCAJEFYNACACIAdqIAVrQSZrIQIDQCACQQFrIgIEQCADQTAgCygCEBEBAEUNAQwCCwsgAyAKIAQgCygCDBEAAA0AIAEgDToAICABIAw2AhxBACEACyAGQTBqJAAgAAuUBwIBfwV+IwBB0AFrIgIkACACIAEQciACKQMgIQMgAikDGCEEIAIpAxAhBSACKQMIIQYgAikDACEHIAJCADcDKCACQQA6ADcgAkEoaiACQTdqQQAgB0Lt////////AxBdIAJCADcDOCACQQA6AEcgAkE4aiACQccAaiACLQA3IAZC/////////wMQXSACQgA3A0ggAkEAOgBXIAJByABqIAJB1wBqIAItAEcgBUL/////////AxBdIAJCADcDWCACQQA6AGcgAkHYAGogAkHnAGogAi0AVyAEQv////////8DEF0gAkIANwNoIAJBADoAdyACQegAaiACQfcAaiACLQBnIANC/////////wMQXSACQgA3A3ggAkH4AGogAi0Ad0IAQn8QaCACQgA3A4ABIAJBADoAjwEgAkGAAWogAkGPAWpBACACKQMoIAIpA3giA0Lt////////A4MQZCACQgA3A5ABIAJBADoAnwEgAkGQ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QQhqNgIYQQEgASADQRhqIAIRAQANABogAygCGEH8j8AAQQIgAygCHCgCDBEAAAs6AAggACAFQQFqNgIAIANBQGskACAAC7gCAQV/IwBBMGsiAyQAIAAgACgCxAEgAmo2AsQBIANBKGogACgCwAEiBCAEIAJBgAEgBGsiBiACIAZJGyIFaiAAQYCfwAAQSCADKAIsIQQgAygCKCADQSBqIAEgAkEAIAVBkJ/AABBHIAQgAygCICADKAIkQaCfwAAQZiAAIAAoAsABIAVqIgQ2AsABAkAgBEGAAUYEfyAAQYABaiAAQYABEBsaIABBADYCwAFBAAUgBAsgAiAGTXINACADQRhqIAEgAiAFQbCfwAAQXiAAQYABaiADKAIYIAMoAhwQGyIFRQ0AIANBEGpBACAFIABBwJ/AABBIIAMoAhQhBCADKAIQIANBCGogASACIAIgBWtB0J/AABBeIAQgAygCCCADKAIMQeCfwAAQZiAAIAU2AsABCyADQTBqJAALrAIBBX8jAEEwayIDJAAgACAAKALEASACajYCxAEgA0EoaiAAIAAoAsABIgQgBCACQYABIARrIgYgAiAGSRsiBWoQUCADKAIsIQQgAygCKCADQSBqQQAgBSABIAJBkJ/AABBJIAQgAygCICADKAIkQaCfwAAQZiAAIAAoAsABIAVqIgQ2AsABAkAgBEGAAUYEfyAAQYABaiAAQYABEBsaIABBADYCwAFBAAUgBAsgAiAGTXINACADQRhqIAEgAiAFQbCfwAAQXiAAQYABaiADKAIYIAMoAhwQGyIFRQ0AIANBEGogACAFEFQgAygCFCEEIAMoAhAgA0EIaiABIAIgAiAFa0HQn8AAEF4gBCADKAIIIAMoAgxB4J/AABBmIAAgBTYCwAELIANBMGokAAv9AQEDfyMAQdAAayIDJAAgACAAKQNAIAEtAIABIgStfDcDQCADQQhqIAFBgAEgBEGMhcAAEF4gAygCDCEEIAMoAgghBQNAIAQEQCAFQQA6AAAgBEEBayEEIAVBAWohBQwBCwsgAUEAOgCAASAAIAFCfxAAIANBKGogAEEYaikDADcDACADQSBqIABBEGopAwA3AwAgA0EYaiAAQQhqKQMANwMAIANBOGogAEEoaikDADcDACADQUBrIABBMGopAwA3AwAgA0HIAGogAEE4aikDADcDACADIAApAwA3AxAgAyAAKQMgNwMwIAIgA0EQakHAABCBARogA0HQAGokAAu3AgAgACABQQAgAkEHdCICQbCZwABqKQMAECMgACABQQEgAkG4mcAAaikDABAjIAAgAUECIAJBwJnAAGopAwAQIyAAIAFBAyACQciZwABqKQMAECMgACABQQQgAkHQmcAAaikDABAjIAAgAUEFIAJB2JnAAGopAwAQIyAAIAFBBiACQeCZwABqKQMAECMgACABQQcgAkHomcAAaikDABAjIAAgAUEIIAJB8JnAAGopAwAQIyAAIAFBCSACQfiZwABqKQMAECMgACABQQogAkGAmsAAaikDABAjIAAgAUELIAJBiJrAAGopAwAQIyAAIAFBDCACQZCawABqKQMAECMgACABQQ0gAkGYmsAAaikDABAjIAAgAUEOIAJBoJrAAGopAwAQIyAAIAFBDyACQaiawABqKQMAECMLhwIBBX8jAEHQA2siBSQAIAVBzAEQgAEiA0EGOwHQASADQYgBNgLMASADQfABaiIGQgA3AwAgA0HoAWoiBUIANwMAIANB4AFqIgRCADcDACADQgA3A9gBIAMgASACECsgA0H4AWoiByADQdgBEIEBGiAHIANB2AFqEBYgA0GQAmoiByAGKQMANwMAIANBiAJqIgYgBSkDADcDACADQYACaiIFIAQpAwA3AwAgAyADKQPYATcD+AFBIBBqIgRBGGogBykDADcAACAEQRBqIAYpAwA3AAAgBEEIaiAFKQMANwAAIAQgAykD+AE3AAAgASACEG0gAEEgNgIEIAAgBDYCACADQdADaiQAC/kBAQV/QQggASABQQhNGyEFQQggACAAQQhNG0EBayIAQYCAfHFBgIAEaiEGIABBeHFBCGohAEHgvcAAIQECQAJ/A0ACQCABIgQoAgAiAUF/RwRAIAEoAgQgAWoiAyAATQ0CIAMgAGsiAiACIAVwayICIAFJDQIgAyAAIAJqIgBLDQEgBCEAIAEMAwtBACECIAZBACAAGyIBQRB2QAAiBEF/Rg0DIARBEHQgARAnQeC9wAAhAQwBCwsgACABNgIAIAAgAyAAazYCBCAEIAA2AgAgACgCAAshAyABIAJHBEAgAyACIAFrNgIEIAIPCyAAIAMoAgA2AgALIAILjQICAX4BfyACQQ9NBEAgAUEHIAJrQQdxQQN0aiIF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A38jAEHQAGsiAyQAIAAoAkggAkcgAkHAAEtyIgVFBEAgA0EQaiIEEEUgACAAQcwAaiAEEB8gA0EIaiAEQcAAIAJB7IbAABBnIAEgAiADKAIIIAMoAgxB/IbAABBmCyADQdAAaiQAIAULWAEBfyMAQSBrIgIkACAAKAIAIQAgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAiAANgIEIAJBBGogAkEIahAPIAJBIGokAAtlAQJ/IwBBQGoiASQAIAFBwAAQgAEhAQNAIAJBwABGRQRAIAEgAmpBsJ7AAEHAACACEC43AwAgAkEIaiECDAELCyAAQYABaiABQcAAEIEBGiAAQYABEIABQgA3A8ABIAFBQGskAAtRAQF/IwBBIGsiAiQAIAIgADYCBCACQRhqIAFBEGopAgA3AwAgAkEQaiABQQhqKQIANwMAIAIgASkCADcDCCACQQRqIAJBCGoQDyACQSBqJAALfgAgACABKQAAQv////////8DgzcDACAAIAFBBmopAABCA4hC/////////wODNwMIIAAgAUEMaikAAEIGiEL/////////A4M3AxAgACABQRNqKQAAQgGIQv////////8DgzcDGCAAIAFBGGopAABCDIhC/////////wODNwMgC8oBAQN/IwBBgAFrIgUkACAFQQhqIgMgAUEoEIEBGiAFQTBqIgQgAkEoEIEBGiAFQdgAaiIBQSgQgAEaIAEgAykDICAEKQMgfUL+////////B3w3AyAgASADKQMYIAQpAxh9Qv7///////8HfDcDGCABIAMpAxAgBCkDEH1C/v///////wd8NwMQIAEgAykDCCAEKQMIfUL+////////B3w3AwggASADKQMAIAQpAwB9Qtr///////8HfDcDACAAIAEQciAFQYABaiQAC00BAn8jAEGAAWsiAiQAIAJBMGogAUEoakEoEIEBGiACQdgAaiABQdAAakEoEIEBGiACQQhqIgMgAUEoEIEBGiAAIAMQFCACQYABaiQAC0cBAn8jAEEgayIBJAAgASAAEAxBACEAA0AgAEEgRkUEQCAAIAFqLQAAIAJyIQIgAEEBaiEADAELCyABQSBqJAAgAkH/AXFFC0cBAn8jAEEgayECA0AgAUEQRkUEQCACQQhqIAFqQQA6AAAgAUEBaiEBDAELCyAAIAIpAwg3AAAgAEEIaiACQRBqKQMANwAAC1gBAX9B6L3AAEHovcAAKAIAIgFBAWo2AgACQCABQQBIDQBB7L3AAEHsvcAAKAIAQQFqIgE2AgAgAUECSw0AIABFQeS9wAAoAgBBAEggAUEBS3JyDQAACwALVwEBfyMAQeAAayIBJAAgAUEIakHAABAlIAEpAwhQRQRAQciNwABBKyABQdgAakHshcAAQaiDwAAQLwALIAAgAUEQakHIABCBAUHIAGoQQyABQeAAaiQAC0wBAn8jAEGQAWsiAiQAA0AgAUGAAUZFBEAgAkEIaiABakEAOgAAIAFBAWohAQwBCwsgACACQQhqQYABEIEBQQA6AIABIAJBkAFqJAALUQEBfyMAQSBrIgMkACADQQxqQQE2AgAgA0EUakEANgIAIANByLjAADYCECADQQA2AgAgAyABNgIcIAMgADYCGCADIANBGGo2AgggAyACEFkAC0cBAn8jAEHQAGsiAiQAA0AgAUHAAEZFBEAgAkEIaiABakEAOgAAIAFBAWohAQwBCwsgACACQQhqQcAAEIEBGiACQdAAaiQAC/0BAQJ/IwBB0ABrIgQkACAEIABBKBCBASIEQShqQSgQgAEaIwBBMGsiAyQAIANCADcDCCADQQhqIAIgBCkDACABKQMAEGggA0IANwMQIANBEGogAiAEKQMIIAEpAwgQaCADQgA3AxggA0EYaiACIAQpAxAgASkDEBBoIANCADcDICADQSBqIAIgBCkDGCABKQMYEGggA0IANwMoIANBKGogAiAEKQMgIAEpAyAQaCAEQShqIgEgAykDCDcDACABIAMpAxA3AwggASADKQMYNwMQIAEgAykDIDcDGCABIAMpAyg3AyAgA0EwaiQAIAAgAUEoEIEBGiAEQdAAaiQACzsAAkAgAyAETQRAIAIgBEkNASAAIAQgA2s2AgQgACABIANqNgIADwsgAyAEIAUQdQALIAQgAiAFEHQACzwAAkAgASACTQRAIAJBgAFNDQEgAkGAASAEEHQACyABIAIgBBB1AAsgACACIAFrNgIEIAAgASADajYCAAs6AAJAIAEgAk0EQCACIARNDQEgAiAEIAUQdAALIAEgAiAFEHUACyAAIAIgAWs2AgQgACABIANqNgIAC4gBAQF/IwBB0ABrIgMkACADIAFBKBCBASIBQShqIAJBKBCBARogAEEoEIABIgIgAUEoaiIAKQMgIAEpAyB8NwMgIAIgACkDGCABKQMYfDcDGCACIAApAxAgASkDEHw3AxAgAiAAKQMIIAEpAwh8NwMIIAIgACkDACABKQMAfDcDACABQdAAaiQAC88JAgF/FX4jAEHQAGsiAyQAIAMgAUEoEIEBIgFBKGogAkEoEIEBGiAAQSgQgAEhAiMAQZADayIDJAAgAyABQShqIgApAyAiCEITfiIJIAEpAyAiCxAyIANBEGogACkDGCINQhN+IgUgCxAyIANBIGogACkDECIKQhN+IgQgCxAyIANBMGogACkDCCIMQhN+IAsQMiADQdAAaiABKQMYIgYgCRAyIANB4ABqIAYgBRAyIANB8ABqIAYgBBAyIANBoAFqIAEpAxAiByAJEDIgA0GwAWogByAFEDIgA0HwAWogASkDCCIEIAkQMiADQUBrIAApAwAiBSALEDIgA0GAAWogBiAMEDIgA0GQAWogBSAGEDIgA0HAAWogByAKEDIgA0HQAWogByAMEDIgA0HgAWogBSAHEDIgA0GAAmogBCANEDIgA0GQAmogBCAKEDIgA0GgAmogBCAMEDIgA0GwAmogBSAEEDIgA0HQAmogASkDACIEIAgQMiADQeACaiAEIA0QMiADQfACaiAEIAoQMiADQYADaiAEIAwQMiADQcACaiAEIAUQMiACIAMpA9ABIg0gAykDAHwiDiADKQOQAnwiDyADKQOQAXwiECADKQPgAnwiESADKQNQIgUgAykDEHwiEiADKQOgAnwiEyADKQPgAXwiFCADKQPwAnwiFSADKQNgIgggAykDIHwiFiADKQOgAXwiFyADKQOwAnwiGCADKQOAA3wiBiADKQMwIgQgAykDcHwiByADKQOwAXwiCSADKQPwAXwiCiADKQPAAnwiC0IziCAKIAtWrSADQcgCaikDACAJIApWrSADQfgBaikDACAHIAlWrSADQbgBaikDACAEIAdWrSADQThqKQMAIANB+ABqKQMAfHx8fHx8fHxCDYaEfCIMQjOIIAYgDFatIAYgGFStIANBiANqKQMAIBcgGFatIANBuAJqKQMAIBYgF1atIANBqAFqKQMAIAggFlatIANB6ABqKQMAIANBKGopAwB8fHx8fHx8fHxCDYaEfCIGQjOIIAYgFVStIBQgFVatIANB+AJqKQMAIBMgFFatIANB6AFqKQMAIBIgE1atIANBqAJqKQMAIAUgElatIANB2ABqKQMAIANBGGopAwB8fHx8fHx8fHxCDYaEfCIIQv////////8DgzcDGCACIAMpA8ABIgQgAykDgAF8IgcgAykDgAJ8IgkgAykDQHwiCiADKQPQAnwiBSAIIBFUrSAQIBFWrSADQegCaikDACAPIBBWrSADQZgBaikDACAOIA9WrSADQZgCaikDACANIA5WrSADQdgBaikDACADQQhqKQMAfHx8fHx8fHx8Qg2GIAhCM4iEfCIIQv////////8DgzcDICACIAUgCFatIAUgClStIANB2AJqKQMAIAkgClatIANByABqKQMAIAcgCVatIANBiAJqKQMAIAQgB1atIANByAFqKQMAIANBiAFqKQMAfHx8fHx8fHx8Qg2GIAhCM4iEQhN+IAtC/////////wODfCIEQv////////8DgzcDACACIAxC/////////wODIARCM4h8IgRC/////////wODNwMIIAIgBkL/////////A4MgBEIziHw3AxAgA0GQA2okACABQdAAaiQACz8BAn8jACIEQYAIa0FAcSIDJAAgASABKQMwQgF8NwMwIAAgAiABEAMgAyACIAAQAyAAIANBgAgQgQEaIAQkAAs/ACACIANPBEAgACADNgIEIAAgATYCACAAQQxqIAIgA2s2AgAgACABIANqNgIIDwtBlILAAEEjQbyEwAAQRAALPgEBfyMAQRBrIgUkACAFQQhqIAFBwAAgAiADIAQQRyAFKAIMIQEgACAFKAIINgIAIAAgATYCBCAFQRBqJAALPgEBfyMAQRBrIgUkACAFQQhqIAIgAyABQcAAIAQQSSAFKAIMIQEgACAFKAIINgIAIAAgATYCBCAFQRBqJAALQQEBfyMAQRBrIgQkACAEQQhqIAIgAyABQYABQYCfwAAQSSAEKAIMIQEgACAEKAIINgIAIAAgATYCBCAEQRBqJAALQQEBfyMAQRBrIgIkACACQQhqIAFBICABKAIgQZyNwAAQZyACKAIMIQEgACACKAIINgIAIAAgATYCBCACQRBqJAALPQEBfyMAQRBrIgUkACAFQQhqQQAgAyABIAIgBBBJIAUoAgwhASAAIAUoAgg2AgAgACABNgIEIAVBEGokAAs5AQF/IwBBkANrIgMkACADEDogAyABIAIQHiADQcgBaiIBIANByAEQgQEaIAAgARAYIANBkANqJAALPwEBfyMAQRBrIgMkACADQQhqIAFBgAEgAkHAn8AAEFIgAygCDCEBIAAgAygCCDYCACAAIAE2AgQgA0EQaiQACxsBAX8jAEEQayICJAAgACABNwAAIAJBEGokAAs5AAJAAn8gAkGAgMQARwRAQQEgACACIAEoAhARAQANARoLIAMNAUEACw8LIAAgA0EAIAEoAgwRAAALPwEBfyMAQRBrIgMkACADQQhqIAFByAEgAkGEusAAEF4gAygCDCEBIAAgAygCCDYCACAAIAE2AgQgA0EQaiQACzIBAn8DQCACQYAIRkUEQCAAIAJqIgMgAykDACABIAJqKQMAhTcDACACQQhqIQIMAQsLC7IBAQF/IwBBIGsiAiQAIAJBAToAGCACIAE2AhQgAiAANgIQIAJB+I7AADYCDCACQci4wAA2AggjAEEQayIAJAAgAkEIaiIBKAIIIgJFBEBByLjAAEErQZC5wAAQRAALIAAgASgCDDYCCCAAIAE2AgQgACACNgIAIAAoAgAiAUEUaigCACECAkACQCABQQxqKAIADgIAAAELIAINACAAKAIELQAQEEEACyAAKAIELQAQEEEACzMBAX8jAEFAaiICJAAgABBFIAIQRSABIAFByABqIAIQHyAAIAJBwAAQgQEaIAJBQGskAAswAQF/IAFBAnQiAgRAIAAgAUEDdCIBIAAgAUsbIAJuDwtBoIXAAEEZQdSJwAAQRAALMgACQCAAQfz///8HSw0AIABFBEBBBA8LIAAgAEH9////B0lBAnQQIiIARQ0AIAAPCwALLgAgACADIAKtQv8Bg30gBH0iA0L/////////A4M3AwAgAUEAIANCM4inazoAAAsnACACIANJBEAgAyACIAQQeAALIAAgAiADazYCBCAAIAEgA2o2AgALIwEBfwNAIAFBwABHBEAgACABakEAOgAAIAFBAWohAQwBCwsLLAEBfyABIAIgAyAEIAUQFyEGIAMgBBBtIAEgAhBtIABBIDYCBCAAIAY2AgALJgEBfyMAQRBrIgIkACACIAE2AgwgACACQQxqQQQQGSACQRBqJAALMAAgASgCACAALQAAQQJ0IgBBuL3AAGooAgAgAEGQvcAAaigCACABKAIEKAIMEQAACyIBAX8jAEEgayIBJAAgASAAEAwgAS0AACABQSBqJABBAXELKgAgASACrUL/AYMgA3wgBHwiA0IziDwAACAAIANC/////////wODNwMACy4AIAEoAgBBrI3AAEG5jcAAIAAoAgAtAAAiABtBDUEPIAAbIAEoAgQoAgwRAAALHgAgASADRgRAIAAgAiABEIEBGg8LIAEgAyAEEDQACyEAIAIgA0kEQCADIAIgBBB0AAsgACADNgIEIAAgATYCAAscACAAIANBACABa63CIgODIANCf4UgAoOENwMACyIBAX8jAEFAaiIBJAAgASAAQcAAEIEBIgAQXyAAQUBrJAALEQAgAEEBECIiAARAIAAPCwALGQAgASgCAEGZlMAAQREgASgCBCgCDBEAAAsZACABKAIAQaqUwABBESABKAIEKAIMEQAACw0AIAEEQCAAIAEQJwsLDgAgACABEFsgAWxBAnQLFAAgACgCACABIAAoAgQoAgwRAQALbQAgAEEoEIABIgBC/v///////wcgASkDIH03AyAgAEL+////////ByABKQMYfTcDGCAAQv7///////8HIAEpAxB9NwMQIABC/v///////wcgASkDCH03AwggAELa////////ByABKQMAfTcDAAsQACABIAAoAgAgACgCBBAHC74BAQR+IABBKBCAASIAIAEpAxggASkDECABKQMIIAEpAwAiAkIziHwiBEIziHwiBUIziHwiA0L/////////A4M3AxggACABKQMgIANCM4h8IgNC/////////wODNwMgIAAgA0IziEITfiACQv////////8Dg3wiAkL/////////A4M3AwAgACAEQv////////8DgyACQjOIfCICQv////////8DgzcDCCAAIAVC/////////wODIAJCM4h8NwMQC5kGAgx+AX8gAEEoEIABIQ4jAEHwAWsiACQAIABB4AFqIAEpAyAiBkITfiAGEDIgAEHQAWogBkImfiIFIAEpAxgiAxAyIABBwAFqIANCE34gAxAyIABBsAFqIAEpAxAiBCAFEDIgAEGgAWogA0ImfiAEEDIgAEGQAWogBCAEEDIgAEGAAWogASkDCCICIAUQMiAAQfAAaiACIANCAYYiBRAyIABB4ABqIARCAYYiBCACEDIgAEHQAGogAiACEDIgACABKQMAIgMgBkIBhhAyIABBEGogAyAFEDIgAEEgaiADIAQQMiAAQTBqIAJCAYYgAxAyIABBQGsgAyADEDIgDiAAKQNgIgsgACkD4AF8IgIgACkDEHwiAyAAKQNQIgkgACkD0AF8IgQgACkDIHwiBiAAKQPAASIMIAApA7ABfCIFIAApAzB8IgcgACkDgAEiDSAAKQOgAXwiCCAAKQNAfCIKQjOIIAggClatIABByABqKQMAIAggDVStIABBiAFqKQMAIABBqAFqKQMAfHx8fEINhoR8IghCM4ggByAIVq0gBSAHVq0gAEE4aikDACAFIAxUrSAAQcgBaikDACAAQbgBaikDAHx8fHx8Qg2GhHwiBUIziCAFIAZUrSAEIAZWrSAAQShqKQMAIAQgCVStIABB2ABqKQMAIABB2AFqKQMAfHx8fHxCDYaEfCIEQv////////8DgzcDGCAOIAApA3AiCSAAKQOQAXwiBiAAKQMAfCIHIAMgBFatIAIgA1atIABBGGopAwAgAiALVK0gAEHoAGopAwAgAEHoAWopAwB8fHx8fEINhiAEQjOIhHwiAkL/////////A4M3AyAgDiACIAdUrSAGIAdWrSAAQQhqKQMAIAYgCVStIABB+ABqKQMAIABBmAFqKQMAfHx8fHxCDYYgAkIziIRCE34gCkL/////////A4N8IgJC/////////wODNwMAIA4gCEL/////////A4MgAkIziHwiAkL/////////A4M3AwggDiAFQv////////8DgyACQjOIfDcDECAAQfABaiQAC3YBAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRRqQQI2AgAgA0EcakECNgIAIANBLGpBAzYCACADQeySwAA2AhAgA0EANgIIIANBAzYCJCADIANBIGo2AhggAyADQQRqNgIoIAMgAzYCICADQQhqIAIQWQALdgEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBFGpBAjYCACADQRxqQQI2AgAgA0EsakEDNgIAIANBoJPAADYCECADQQA2AgggA0EDNgIkIAMgA0EgajYCGCADIANBBGo2AiggAyADNgIgIANBCGogAhBZAAtDAQR/QSghAwJAA0AgAC0AACIEIAEtAAAiBUYEQCAAQQFqIQAgAUEBaiEBIANBAWsiAw0BDAILCyAEIAVrIQILIAJFCwsAIAAgARBbQQJ0C3YBAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRRqQQI2AgAgA0EcakECNgIAIANBLGpBAzYCACADQcySwAA2AhAgA0EANgIIIANBAzYCJCADIANBIGo2AhggAyADQQRqNgIoIAMgAzYCICADQQhqIAIQWQALQAAgACgCACEAIAJBB3QhAgNAIAIEQCAAIAApA0BCgAF8NwNAIAAgAUIAEAAgAkGAAWshAiABQYABaiEBDAELCwsOACAAKAIAGgNADAALAAsNACAAKAIAIAEgAhAQCw4AIAAQCSAAQQA2AsgBCwsAIAAjAGokACMACw0AIAFB5JHAAEECEAcLlAUBB38CQAJAAn8CQCACIgMgACABa0sEQCABIANqIQUgACADaiECIANBD0sNASAADAILIANBD00EQCAAIQIMAwsgAEEAIABrQQNxIgVqIQQgBQRAIAAhAiABIQADQCACIAAtAAA6AAAgAEEBaiEAIAJBAWoiAiAESQ0ACwsgBCADIAVrIgNBfHEiBmohAgJAIAEgBWoiBUEDcSIABEAgBkEATA0BIAVBfHEiB0EEaiEBQQAgAEEDdCIIa0EYcSEJIAcoAgAhAANAIAQgACAIdiABKAIAIgAgCXRyNgIAIAFBBGohASAEQQRqIgQgAkkNAAsMAQsgBkEATA0AIAUhAQNAIAQgASgCADYCACABQQRqIQEgBEEEaiIEIAJJDQALCyADQQNxIQMgBSAGaiEBDAILIAJBfHEhAEEAIAJBA3EiBmshByAGBEAgASADakEBayEEA0AgAkEBayICIAQtAAA6AAAgBEEBayEEIAAgAkkNAAsLIAAgAyAGayIGQXxxIgNrIQJBACADayEDAkAgBSAHaiIFQQNxIgQEQCADQQBODQEgBUF8cSIHQQRrIQFBACAEQQN0IghrQRhxIQkgBygCACEEA0AgAEEEayIAIAQgCXQgASgCACIEIAh2cjYCACABQQRrIQEgACACSw0ACwwBCyADQQBODQAgASAGakEEayEBA0AgAEEEayIAIAEoAgA2AgAgAUEEayEBIAAgAksNAAsLIAZBA3EiAEUNAiADIAVqIQUgAiAAawshACAFQQFrIQEDQCACQQFrIgIgAS0AADoAACABQQFrIQEgACACSQ0ACwwBCyADRQ0AIAIgA2ohAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIABJDQALCwufAQEDfwJAIAEiAkEPTQRAIAAhAQwBCyAAQQAgAGtBA3EiBGohAyAEBEAgACEBA0AgAUEAOgAAIAFBAWoiASADSQ0ACwsgAyACIARrIgJBfHEiBGohASAEQQBKBEADQCADQQA2AgAgA0EEaiIDIAFJDQALCyACQQNxIQILIAIEQCABIAJqIQIDQCABQQA6AAAgAUEBaiIBIAJJDQALCyAAC7MCAQd/AkAgAiIEQQ9NBEAgACECDAELIABBACAAa0EDcSIDaiEFIAMEQCAAIQIgASEGA0AgAiAGLQAAOgAAIAZBAWohBiACQQFqIgIgBUkNAAsLIAUgBCADayIIQXxxIgdqIQICQCABIANqIgNBA3EiBARAIAdBAEwNASADQXxxIgZBBGohAUEAIARBA3QiCWtBGHEhBCAGKAIAIQYDQCAFIAYgCXYgASgCACIGIAR0cjYCACABQQRqIQEgBUEEaiIFIAJJDQALDAELIAdBAEwNACADIQEDQCAFIAEoAgA2AgAgAUEEaiEBIAVBBGoiBSACSQ0ACwsgCEEDcSEEIAMgB2ohAQsgBARAIAIgBGohAwNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANJDQALCyAAC0wAAkACQAJAIAEOAgABAgtBAEEAQYyXwAAQMwALQQFBAUGcl8AAEDMACyABQQJNBEBBAkECQayXwAAQMwALIAAzAAAgADEAAkIQhoQLWQACQAJAAkAgAQ4CAAECC0EAQQBBzJbAABAzAAtBAUEBQdyWwAAQMwALAkAgAUECSwRAIAFBA0cNAUEDQQNB/JbAABAzAAtBAkECQeyWwAAQMwALIAA1AAALDQBCrrfwl5Dx1ZqxfwsDAAELC9E9BABBgIDAAAvBFFAQEABpAAAAWwEAABUAAABQEBAAaQAAAFwBAAATAAAAUBAQAGkAAABqAQAAIAAAAAcAAAABAAAAAQAAAAgAAAAHAAAAAQAAAAEAAAAJAAAAc3JjL2xpYi5ycwAAUAAQAAoAAAARAAAALQAAAFAAEAAKAAAAGQAAADkAAABQABAACgAAACEAAAA5AAAAUAAQAAoAAAAiAAAANwAAAFZlZ2FfU1BBTV9Qb1cAAABQABAACgAAAGMAAAA3AAAAUAAQAAoAAABpAAAACgAAAGxpYnJhcnkvYWxsb2Mvc3JjL3Jhd192ZWMucnNjYXBhY2l0eSBvdmVyZmxvdwAAAOgAEAARAAAAzAAQABwAAAAMAgAABQAAAGFzc2VydGlvbiBmYWlsZWQ6IG1pZCA8PSBzZWxmLmxlbigpL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvZGlnZXN0LTAuMTAuNi9zcmMvY29yZV9hcGkvY3RfdmFyaWFibGUucnMAAAA3ARAAbgAAAI0AAAArAAAAL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvYmxvY2stYnVmZmVyLTAuMTAuNC9zcmMvbGliLnJzALgBEABjAAAAnQAAAA0AAAC4ARAAYwAAAJ0AAAAlAAAAuAEQAGMAAACiAAAAJwAAALgBEABjAAAApAAAAA0AAAC4ARAAYwAAAKQAAAAgAAAAuAEQAGMAAACuAAAACQAAALgBEABjAAAArgAAABoAAAC4ARAAYwAAALwAAAAJAAAAAAAAAGF0dGVtcHQgdG8gZGl2aWRlIGJ5IHplcm9jaHVuayBzaXplIG11c3QgYmUgbm9uLXplcm+5AhAAGwAAAAcAAAAAAAAAAQAAAAoAAAAHAAAAAAAAAAEAAAALAAAAL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvZGlnZXN0LTAuMTAuNi9zcmMvY29yZV9hcGkvcnRfdmFyaWFibGUucnMAAPwCEABuAAAALQAAADUAAAD8AhAAbgAAAC0AAAAkAAAAL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvYXJnb24yLTAuNS4wL3NyYy9ibGFrZTJiX2xvbmcucnMAAACMAxAAZQAAADIAAAAFAAAAjAMQAGUAAAAyAAAAGgAAAIwDEABlAAAAOgAAABIAAACMAxAAZQAAAEIAAAAPAAAAjAMQAGUAAABLAAAAIQAAAGludmFsaWQgQmxha2UyYlZhciBvdXQgbGVuZ3RoAAAAjAMQAGUAAABMAAAACgAAAC9ob21lL2VtaWxiYXllcy8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby02ZjE3ZDIyYmJhMTUwMDFmL2FyZ29uMi0wLjUuMC9zcmMvcGFyYW1zLnJzAHQEEABfAAAAsgAAAAkAAAAvaG9tZS9lbWlsYmF5ZXMvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tNmYxN2QyMmJiYTE1MDAxZi9hcmdvbjItMC41LjAvc3JjL2xpYi5yc+QEEABcAAAAGgEAACgAAADkBBAAXAAAABsBAAAfAAAA5AQQAFwAAABtAQAAHQAAAOQEEABcAAAAoAEAAC4AAADkBBAAXAAAAKABAABKAAAA5AQQAFwAAACjAQAAHQAAAOQEEABcAAAApQEAAB0AAADkBBAAXAAAALoBAAAdAAAA5AQQAFwAAAC/AQAAGwAAAFZlcnNpb25JbnZhbGlkVGltZVRvb1NtYWxsVGhyZWFkc1Rvb01hbnlUaHJlYWRzVG9vRmV3U2VjcmV0VG9vTG9uZ1NhbHRUb29Mb25nU2FsdFRvb1Nob3J0UHdkVG9vTG9uZ091dHB1dFRvb0xvbmdPdXRwdXRUb29TaG9ydE1lbW9yeVRvb011Y2hNZW1vcnlUb29MaXR0bGVLZXlJZFRvb0xvbmdCNjRFbmNvZGluZ0FsZ29yaXRobUludmFsaWRBZFRvb0xvbmcAAHQEEABfAAAAHwEAAAEAAABJbnZhbGlkTGVuZ3RoSW52YWxpZEVuY29kaW5nY2FsbGVkIGBSZXN1bHQ6OnVud3JhcCgpYCBvbiBhbiBgRXJyYCB2YWx1ZQAHAAAAAAAAAAEAAAAMAAAAL2hvbWUvZW1pbGJheWVzLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvYmxha2UyLTAuMTAuNi9zcmMvbGliLnJzAAAABAcQAF0AAAByAAAAAQAAACkAAAANAAAAAAAAAAEAAAAOAAAAaW5kZXggb3V0IG9mIGJvdW5kczogdGhlIGxlbiBpcyAgYnV0IHRoZSBpbmRleCBpcyAAAIgHEAAgAAAAqAcQABIAAAA6IAAASBwQAAAA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');

	const crate = async () => {
	  await init$3(wasm_code);
	  return exports$1
	};

	// Start loading the wasm right away and "memoize" promise
	const wasm = crate();

	const VEGA_ALGORITHM_NAME = 'vega/ed25519';
	const VEGA_ALGORITHM_VERSION = 1;

	const CHAIN_ID_DELIMITER = string$1E('\0');

	async function _hash (message, chainId) {
	  if (chainId != null) message = concat(string$1E(chainId), CHAIN_ID_DELIMITER, message);
	  const digest = (await wasm).sha3_256_hash(message);

	  return digest
	}

	class PublicKey {
	  /**
	   * @param {Uint8Array} pk - 32-byte secret key
	   */
	  constructor (pk) {
	    assert$r(pk instanceof Uint8Array);
	    assert$r(pk.byteLength === 32);

	    /** @private */
	    this._pk = pk;
	  }

	  /**
	   * Verify Vega EdDSA signature on message. Vega EdDSA is a EdDSA signature
	   * over the SHA3-256 digest of message
	   * @param  {Uint8Array} signature
	   * @param  {Uint8Array} message
	   * @param  {string | Uint8Array} [chainId]
	   * @return {Promise<boolean>}
	   */
	  async verify (signature, message, chainId) {
	    assert$r(signature instanceof Uint8Array);
	    assert$r(signature.byteLength === 64);
	    assert$r(message instanceof Uint8Array);

	    const digest = await this.hash(message, chainId);
	    return this.verifyRaw(signature, digest)
	  }

	  /**
	   * Verify a direct EdDSA signature
	   *
	   * @param {Uint8Array} bytes
	   * @returns
	   */
	  async verifyRaw (signature, bytes) {
	    return (await wasm).ed25519_verify(signature, bytes, this._pk)
	  }

	  /**
	   * Compute the SHA3-256 digest of message, optionally prepending chainId and the delimiter
	   * @param {Uint8Array} message
	   * @param {string|Uint8Array} [chainId]
	   * @returns
	   */
	  async hash (message, chainId) {
	    return _hash(message, chainId)
	  }

	  /**
	   * Encode public key as hex string
	   * @return {string}
	   */
	  toString () {
	    return toHex(this._pk)
	  }

	  toJSON () {
	    return this.toString()
	  }
	}

	/** @type {number} Byte length of a public key */
	PublicKey.BYTES = 32;

	class SecretKey {
	  /**
	   * @param {Uint8Array} sk - 64-byte secret key
	   */
	  constructor (sk) {
	    assert$r(sk instanceof Uint8Array);
	    assert$r(sk.byteLength === 64);

	    /** @private */
	    this._sk = sk;
	  }

	  /**
	   * Create a Vega EdDSA signature on message. Vega EdDSA is a EdDSA signature
	   * over the SHA3-256 digest of message, optionally prepending chainId and the delimiter
	   * @param  {Uint8Array} message
	   * @param  {string | Uint8Array} [chainId]
	   * @return {Promise<Uint8Array>}
	   */
	  async sign (message, chainId) {
	    assert$r(message instanceof Uint8Array);

	    const digest = await this.hash(message, chainId);

	    return this.signRaw(digest)
	  }

	  /**
	   * Create a direct EdDSA signature
	   *
	   * @param {Uint8Array} bytes
	   * @returns
	   */
	  async signRaw (bytes) {
	    return (await wasm).ed25519_sign(bytes, this._sk)
	  }

	  /**
	   * Compute the SHA3-256 digest of message, optionally prepending chainId and the delimiter
	   * @param {Uint8Array} message
	   * @param {string|Uint8Array} [chainId]
	   * @returns
	   */
	  async hash (message, chainId) {
	    return _hash(message, chainId)
	  }

	  /**
	   * Encode secret key as hex string
	   * @return {string}
	   */
	  toString () {
	    return toHex(this._sk)
	  }

	  toJSON () {
	    return this.toString()
	  }
	}

	/** @type {number} Byte length of a secret key */
	SecretKey.BYTES = 64;

	class KeyPair {
	  constructor (index, secretKey, publicKey) {
	    this.algorithm = {
	      name: VEGA_ALGORITHM_NAME,
	      version: VEGA_ALGORITHM_VERSION
	    };

	    this.index = index;

	    this.publicKey = new PublicKey(publicKey);

	    /** @private */
	    this.secretKey = new SecretKey(secretKey);
	  }

	  /**
	   * Verify Vega EdDSA signature on message. Vega EdDSA is a EdDSA signature
	   * over the SHA3-256 digest of message
	   * @async
	   * @param  {Uint8Array} signature
	   * @param  {Uint8Array} message
	   * @param  {string | Uint8Array} [chainId]
	   * @return {Promise<boolean>}
	   */
	  verify (signature, message, chainId) {
	    return this.publicKey.verify(signature, message, chainId)
	  }

	  verifyRaw (signature, message) {
	    return this.publicKey.verifyRaw(signature, message)
	  }

	  /**
	   * Create a Vega EdDSA signature on message. Vega EdDSA is a EdDSA signature
	   * over the SHA3-256 digest of message
	   * @async
	   * @param  {Uint8Array} message
	   * @param  {string | Uint8Array} [chainId]
	   * @return {Promise<Uint8Array>}
	   */
	  sign (message, chainId) {
	    return this.secretKey.sign(message, chainId)
	  }

	  signRaw (message) {
	    return this.secretKey.signRaw(message)
	  }

	  /**
	   * Compute the SHA3-256 digest of message, optionally prepending chainId and the delimiter
	   * @param {Uint8Array} message
	   * @param {string|Uint8Array} [chainId]
	   * @returns
	   */
	  hash (message, chainId) {
	    return _hash(message, chainId)
	  }

	  static async fromSeed (index, seed) {
	    const sk = (await wasm).ed25519_keypair_from_seed(seed);

	    return new this(index, sk, sk.subarray(32))
	  }

	  toJSON () {
	    return {
	      index: this.index,
	      publicKey: this.publicKey.toJSON()
	    }
	  }
	}

	// Private accessors
	const kChainCode = Symbol('ChainCode');
	const kSecretKey = Symbol('SecretKey');

	/**
	 * SLIP-0010 Ed25519 key derivation
	 * @type {string}
	 */
	const CURVE_ED25519 = CURVE_ED25519$1;

	/**
	 * Hardended child node offset. Use with `.child(index + HARDENED)` or
	 * `.keyPair(index + HARDENED)`
	 * @type {number}
	 */
	const HARDENED = HARDENED_OFFSET;

	class HDWallet {
	  /**
	   * Create a new subnode (wallet) from a secret key and chain code. Use the
	   * static functions `fromSeed` and `fromMnemonic` to create a new master
	   * wallet
	   *
	   * @param  {Uint8Array} secretKey - 32 bytes secret key
	   * @param  {Uint8Array} chainCode - 32 bytes chain code
	   */
	  constructor (secretKey, chainCode) {
	    /** @private */
	    this[kChainCode] = chainCode;
	    /** @private */
	    this[kSecretKey] = secretKey;
	  }

	  /**
	   * This is a non-standard method to get the public key for an internal HD node
	   * This is used in Vega to identify a wallet
	   *
	   * @returns {Promise<string>}
	   */
	  async generatePublicKey () {
	    return toHex((await wasm).ed25519_keypair_from_seed(this[kSecretKey]).subarray(32))
	  }

	  /**
	   * Derive a new sub-wallet from the current wallet. Index ≥ 2^31 creates a
	   * hardened child node.
	   * @async
	   * @param  {number} index
	   * @return {Promise<HDWallet>}
	   */
	  async child (index) {
	    const { secretKey, chainCode } = await child(this[kSecretKey], this[kChainCode], index);

	    return new this.constructor(secretKey, chainCode)
	  }

	  /**
	   * @async
	   * @param  {number} index
	   * @return {Promise<KeyPair>}
	   */
	  async keyPair (index) {
	    const { secretKey } = await child(this[kSecretKey], this[kChainCode], index);

	    return await KeyPair.fromSeed(index, secretKey)
	  }

	  /**
	   * Create a new BIP-0039 derived wallet. Note that the mnemonic is not
	   * validated.
	   *
	   * @async
	   * @param  {string | Uint8Array} mnemonic - BIP-0039 space delimited mnemonic
	   * @param  {string | Uint8Array} [password=""] - Optional password
	   * @param  {string} [curve=CURVE_ED25519] - Elliptic Curve
	   * @return {Promise<HDWallet>}
	   */
	  static async fromMnemonic (mnemonic, password, curve = CURVE_ED25519) {
	    assert$r(curve === CURVE_ED25519, 'Only Ed25519 is supported for now');

	    const seed = await this.deriveSeed(mnemonic, password);

	    return this.fromSeed(seed, curve)
	  }

	  /**
	   * Helper to derive a BIP-0039 seed from a mnemonic. Not that the mnemonic is
	   * not validated.
	   *
	   * @async
	   * @param  {string | Uint8Array} mnemonic - BIP-0039 space delimited mnemonic
	   * @param  {string | Uint8Array} [password=""] - Optional password
	   * @returns {Promise<Uint8Array>}
	   */
	  static async deriveSeed (mnemonic, password = '') {
	    assert$r(mnemonic instanceof Uint8Array || typeof mnemonic === 'string');
	    assert$r(password instanceof Uint8Array || typeof password === 'string');

	    return seed(mnemonic, password)
	  }

	  /**
	   * Create a new wallet from a seed.
	   *
	   * @async
	   * @param  {Uint8Array} seed
	   * @param  {string} [curve=CURVE_ED25519] - Elliptic Curve
	   * @return {Promise<HDWallet>}
	   */
	  static async fromSeed (seed, curve = CURVE_ED25519) {
	    assert$r(seed instanceof Uint8Array);
	    assert$r(curve === CURVE_ED25519, 'Only Ed25519 is supported for now');

	    const { secretKey, chainCode } = await master(seed, curve);

	    return new this(secretKey, chainCode)
	  }
	}

	const name$1 = 'sha3_24_rounds';

	const U64_MAX$1 = 2n ** 64n - 1n;

	/**
	 * @param {number} difficulty
	 * @param {string} blockHash
	 * @param {string} tid
	 * @param {bigint} [startNonce=0n]
	 */
	async function solve$2 (difficulty, blockHash, tid, startNonce = 0n, endNonce = U64_MAX$1) {
	  const crate = await wasm;

	  assert$r(difficulty <= 50 && difficulty > 0);
	  assert$r(typeof blockHash === 'string', 'blockHash must be hex string');
	  assert$r(blockHash.length === 64, 'blockHash must be 64 hex chars');
	  assert$r(typeof tid === 'string', 'tid must be hex string');
	  assert$r(tid.length === 64, 'tid must be 64 hex chars');
	  assert$r(typeof startNonce === 'bigint', 'startNonce must be bigint');
	  assert$r(startNonce >= 0, 'startNonce must be positive');
	  assert$r(startNonce <= U64_MAX$1, 'startNonce must be U64');

	  return crate.sha3r24_pow_solve(difficulty, string$1E(blockHash), string$1E(tid), startNonce, endNonce)
	}

	/**
	 * @param {number} difficulty
	 * @param {string} blockHash
	 * @param {string} tid
	 * @param {bigint} [startNonce=0n]
	 * @param {bigint} [endNonce=U64_MAX]
	 */
	async function solve$1 (difficulty, blockHash, tid, startNonce = undefined, endNonce = undefined) {
	  return {
	    nonce: await solve$2(difficulty, blockHash, tid, startNonce, endNonce),
	    tid,
	    hashFunction: name$1
	  }
	}

	const SLIP44_VEGA_COINTYPE = 1789;
	const VEGA_DEFAULT_KEYSPACE = 0;

	const VEGA_DEFAULT_PATH = [
	  HARDENED + SLIP44_VEGA_COINTYPE,
	  HARDENED + VEGA_DEFAULT_KEYSPACE
	];

	class VegaWallet extends HDWallet {
	  /**
	   * @async
	   * @param {Uint8Array} seed
	   * @returns {Promise<VegaWallet>}
	   */
	  static async fromSeed (seed) {
	    const master = await super.fromSeed(seed);

	    const vega = await master.child(VEGA_DEFAULT_PATH[0]);
	    const defaultUsage = await vega.child(VEGA_DEFAULT_PATH[1]);

	    defaultUsage.id = await vega.generatePublicKey();

	    return defaultUsage
	  }
	}

	// Inlined implementation of BIP0039 for supply-chain security
	// Please be very careful when editing the algorithms below

	async function validate (phrase) {
	  if (typeof phrase === 'string') return validate(normalize(phrase))
	  assert$r(Array.isArray(phrase), 'phrase must be a string or array of words');

	  if ([12, 15, 18, 21, 24].includes(phrase.length) === false) throw new Error('phrase must be 12, 15, 18, 21 or 24 words')

	  const phraseBytes = new Uint8Array(Math.ceil(phrase.length * 11 / 8));
	  for (let i = 0; i < phrase.length; i++) {
	    const idx = wordlist.indexOf(phrase[i]);

	    if (idx === -1) throw new Error(`word "${phrase[i]}" is not in the wordlist`)

	    bits11Set(phraseBytes, i, idx);
	  }

	  const checksumBits = phrase.length / 3;
	  // The entropy is always an even number of bytes so the checksum will just be
	  // a few spare bits in the last byte. Hence we can always slice off the checksum byte
	  const entropy = phraseBytes.slice(0, phraseBytes.byteLength - 1);

	  const checksumHash = await sha256(entropy);
	  const checksum = checksumHash[0] & (0xff << (8 - checksumBits));

	  if (checksum !== phraseBytes[phraseBytes.byteLength - 1]) throw new Error('checksum mismatch, phrase corrupted. The last word is a checksum')

	  return true
	}

	function normalize (phrase) {
	  return phrase.toLowerCase().split(/\s+/)
	}

	function bits11Set (bytes, idx, bits11) {
	  for (let offset = 11 * idx, end = offset + 11; offset < end; ++offset) {
	    bytes[offset >> 3] |= (bits11 >> (end - offset - 1) & 1) << (7 - (offset % 8));
	  }
	}

	function bits11At (bytes, idx) {
	  // I know this implementation is fairly naive. It's treating the byte array as a bitfield
	  // and extracting one bit at a time. For now this simple solution is good enough, but we
	  // can improve it to read chunks of bits at a time
	  let bits11 = 0;

	  for (let offset = 11 * idx, end = offset + 11; offset < end; ++offset) {
	    bits11 = (bits11 << 1) | !!(bytes[offset >> 3] & (128 >> (offset % 8)));
	  }

	  return bits11
	}

	/**
	 * Generate a new english mnemonic with a given bit strength. Uses a cryptographic source of entropy
	 *
	 * @async
	 * @param {number} [bits=256] bits Bit strength of the mnemonic. Defaults to 256
	 *                                 Valid values include 128, 160, 190, 224, 256
	 * @returns {Promise<string[]>}    List of mnemonic words. Normally joined into a single string delimited by spaces
	 */
	async function generate (bits) {
	  return toMnemonic(await entropy(bits))
	}

	/**
	 * Convert bytes of entropy, including a checksum, to an english mnemonic
	 *
	 * @async
	 * @param {Uint8Array} entropy     Source entropy including a checksum
	 * @returns {Promise<string[]>}    List of mnemonic words. Normally joined into a single string delimited by spaces
	 */
	async function toMnemonic (entropy) {
	  assert$r([12, 15, 18, 21, 24].includes(entropy.byteLength * 8 / 11 | 0), 'entropy must be 128 - 256 bits and multiple of 32 bits and include a checksum');

	  const mnemonic = new Array(entropy.byteLength * 8 / 11 | 0);

	  for (let i = 0; i < mnemonic.length; i++) mnemonic[i] = wordlist[bits11At(entropy, i)];

	  return mnemonic
	}

	/**
	 * Generate bytes of entropy, including checksum
	 *
	 * @async
	 * @param {number} [bits=256] bits Bit strength of the mnemonic. Defaults to 256
	 *                                 Valid values include 128, 160, 190, 224, 256
	 * @returns {Promise<Uint8Array>}           Entropy including checksum
	 */
	async function entropy (bits = 256) {
	  assert$r([128, 160, 192, 224, 256].includes(bits), 'bits must be 128 - 256 bits and multiple of 32 bits');

	  return await checksum(randomFill(new Uint8Array(bits / 8)))
	}

	/**
	 * Copies source entropy and appends a checksum byte at the end.
	 * Note the source is copied sync and can hence be cleared in the same tick
	 *
	 * @async
	 * @param {Uint8Array} entropy     Source entropy
	 * @returns {Promise<Uint8Array}   Source entropy including appended checksum
	 */
	async function checksum (entropy) {
	  assert$r([16, 20, 24, 28, 32].includes(entropy.byteLength), 'entropy must be 16 - 32 bytes');
	  const bits = entropy.byteLength * 8;
	  const checksumBits = bits / 32;
	  const random = new Uint8Array(Math.ceil((bits + checksumBits) / 8));
	  random.set(entropy);

	  const checksumHash = await sha256(random.subarray(0, bits / 8));
	  const checksum = checksumHash[0] & (0xff << (8 - checksumBits));
	  random[bits / 8] |= checksum;

	  return random
	}

	/**
	 * BIP-0039 english wordlist
	 * @type {string[]}
	 */
	const wordlist = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split('\n');

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

	/**
	 * Storage proxy that wraps all methods in a mutex to prevent concurrent access
	 * to the underlying storage. It also provides a transaction method to run
	 * multiple operations in a single mutex lock.
	 *
	 * @param {StorageLocalMap} storage
	 * @returns {StorageLocalMap}
	 */
	class ConcurrentStorage {
	  constructor(storage) {
	    this._storage = storage;
	    this._lock = mutex();

	    /**
	     * @param {string} key
	     * @returns {Promise<boolean>}
	     */
	    this.has = wrapMutexify(this._storage.has.bind(this._storage));

	    /**
	     * @param {string} key
	     * @returns {Promise<any>}
	     */
	    this.get = wrapMutexify(this._storage.get.bind(this._storage));

	    /**
	     * @param {string} key
	     * @param {any} value
	     * @returns {Promise<this>}
	     */
	    this.set = wrapMutexify(this._storage.set.bind(this._storage));

	    /**
	     * @param {string} key
	     * @returns {Promise<boolean>}
	     */
	    this.delete = wrapMutexify(this._storage.delete.bind(this._storage));

	    /**
	     * @returns {Promise<void>}
	     */
	    this.clear = wrapMutexify(this._storage.clear.bind(this._storage));

	    /**
	     * @returns {Promise<IterableIterator<string>}
	     */
	    this.keys = wrapMutexify(this._storage.keys.bind(this._storage));

	    /**
	     * @returns {Promise<IterableIterator<any>}
	     */
	    this.values = wrapMutexify(this._storage.values.bind(this._storage));

	    /**
	     * @returns {Promise<IterableIterator<[string, any]>}
	     */
	    this.entries = wrapMutexify(this._storage.entries.bind(this._storage));

	    const self = this;
	    function wrapMutexify(fn) {
	      return async (...args) => {
	        const release = await self._lock();
	        try {
	          return await fn(...args)
	        } finally {
	          release();
	        }
	      }
	    }
	  }

	  /**
	   * @param {function(StorageLocalMap): Promise<any>} fn
	   * @returns {Promise<any>}
	   * @throws {Error} if fn throws
	   * @throws {Error} if lock is already acquired
	   */
	  async transaction(fn) {
	    const release = await this._lock();
	    try {
	      return await fn(this._storage)
	    } finally {
	      release();
	    }
	  }
	}

	class WalletCollection {
	  constructor({ walletsStore, publicKeyIndexStore }) {
	    this.store = new ConcurrentStorage(walletsStore);
	    this.index = new ConcurrentStorage(publicKeyIndexStore);
	  }

	  async get({ name }) {
	    return this.store.get(name)
	  }

	  async getKeyInfo({ publicKey }) {
	    return this.index.get(publicKey)
	  }

	  async getKeypair({ publicKey }) {
	    return this.store.transaction(async (store) => {
	      const { wallet } = (await this.index.get(publicKey)) ?? {};
	      if (wallet == null) return

	      const walletConfig = await store.get(wallet);
	      if (walletConfig == null) return

	      const keyConfig = walletConfig.keys.find((k) => k.publicKey === publicKey);
	      if (keyConfig == null) return

	      const walletInst = await VegaWallet.fromSeed(new Uint8Array(walletConfig.seed));
	      const keyPair = await walletInst.keyPair(keyConfig.index);

	      return {
	        keyPair,
	        wallet,
	        ...keyConfig
	      }
	    })
	  }

	  async list() {
	    return Array.from(await this.store.keys())
	  }

	  async listKeys({ wallet }) {
	    const walletConfig = await this.get({ name: wallet });

	    if (walletConfig == null) {
	      throw new Error(`Cannot find wallet with name "${wallet}".`)
	    }

	    return walletConfig.keys
	  }

	  async exportKey({ publicKey }) {
	    const key = await this.getKeypair({ publicKey });

	    if (key == null) {
	      throw new Error(`Cannot find key with public key "${publicKey}".`)
	    }

	    return {
	      publicKey: key.keyPair.publicKey.toString(),
	      secretKey: key.keyPair.secretKey.toString()
	    }
	  }

	  async exportRecoveryPhrase({ walletName }) {
	    const wallet = await this.store.get(walletName);

	    if (wallet == null) {
	      throw new Error(`Cannot find wallet "${walletName}".`)
	    }

	    return { recoveryPhrase: wallet.recoveryPhrase }
	  }

	  async generateRecoveryPhrase() {
	    const bitStrength = 256; // 24 words
	    return (await generate(bitStrength)).join(' ')
	  }

	  async import({ name, recoveryPhrase }) {
	    try {
	      await validate(recoveryPhrase);

	      const words = recoveryPhrase.split(/\s+/);
	      if (words.length !== 24) throw new Error('Recovery phrase must be 24 words')
	    } catch (err) {
	      throw new Error(err.message)
	    }

	    return await this.store.transaction(async (store) => {
	      if (await store.has(name)) throw new Error(`Wallet with name "${name}" already exists.`)

	      const seed = await VegaWallet.deriveSeed(recoveryPhrase);

	      await store.set(name, {
	        seed: Array.from(seed),
	        recoveryPhrase,
	        keys: []
	      });

	      return null
	    })
	  }

	  async _generateKey({ walletInstance, index, name, metadata, options }) {
	    const keyPair = await walletInstance.keyPair(index);
	    const publicKey = keyPair.publicKey.toString();

	    if (name == null) name = `Key ${keyPair.index - HARDENED}`;

	    return { name, publicKey, index: keyPair.index, metadata, options }
	  }

	  async generateKey({ wallet: walletName, name, metadata, options }) {
	    return await this.store.transaction(async (store) => {
	      const walletConfig = await store.get(walletName);

	      if (walletConfig == null) {
	        throw new Error(`Cannot find wallet with name "${walletName}".`)
	      }

	      const wallet = await VegaWallet.fromSeed(new Uint8Array(walletConfig.seed));

	      const lastKey = walletConfig.keys.at(-1) ?? {};
	      const lastKeyIndex = (lastKey.index ?? HARDENED) + 1;
	      const key = await this._generateKey({ walletInstance: wallet, name, metadata, options, index: lastKeyIndex });

	      walletConfig.keys.push(key);
	      await store.set(walletName, walletConfig);

	      await this.index.set(key.publicKey, { name: key.name, wallet: walletName, publicKey: key.publicKey });

	      return key
	    })
	  }

	  async renameKey({ publicKey, name }) {
	    return await this.store.transaction(async (store) => {
	      const indexEntry = await this.index.get(publicKey);
	      const { wallet } = indexEntry ?? {};
	      if (indexEntry == null) throw new Error(`Cannot find key with public key "${publicKey}".`)

	      const walletConfig = await store.get(wallet);
	      if (walletConfig == null) throw new Error(`Cannot find wallet with name "${wallet}".`)

	      const keyConfig = walletConfig.keys.find((k) => k.publicKey === publicKey);
	      if (keyConfig == null) throw new Error(`Cannot find key with public key "${publicKey}".`)

	      keyConfig.name = name;
	      indexEntry.name = name;

	      await store.set(wallet, walletConfig);
	      await this.index.set(publicKey, indexEntry);

	      return keyConfig
	    })
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

	class ConnectionsCollection {
	  constructor({ connectionsStore, publicKeyIndexStore }) {
	    this.store = connectionsStore;
	    this.index = publicKeyIndexStore;

	    this._emitter = new TinyEventemitter();
	  }

	  on(event, listener) {
	    return this._emitter.on(event, listener)
	  }

	  off(event, listener) {
	    return this._emitter.off(event, listener)
	  }

	  /**
	   * Set a connection.
	   *
	   * @param {string} origin - The origin of the connection
	   * @param {object} params - The connection parameters
	   * @param {string[]} params.allowList.publicKeys - Individual public keys visible to a connection
	   * @param {string[]} params.allowList.wallets - Complete wallets visible to a connection
	   * @param {string} [params.chainId] - The chainId that was approved for the connection
	   * @param {string} [params.networkId] - Preferred networkId that was approved for the connection
	   * @returns {Promise<void>}
	   */
	  async set(origin, { allowList, chainId = null, networkId = null, accessedAt }) {
	    const value = {
	      origin,
	      allowList,
	      chainId,
	      networkId,
	      accessedAt: accessedAt ?? Date.now()
	    };

	    const res = await this.store.set(origin, value);

	    this._emitter.emit('set', value);

	    return res
	  }

	  /**
	   * Update the last access time of a connection.
	   * Like UNIX `touch`
	   *
	   * @param {string} origin - The origin of the connection
	   * @returns {Promise<void>}
	   */
	  async touch(origin) {
	    return await this.store.transaction(async (store) => {
	      const conn = await store.get(origin);
	      if (conn == null) return

	      conn.accessedAt = Date.now();

	      await store.set(origin, conn);
	      this._emitter.emit('set', conn);
	    })
	  }

	  async has(origin) {
	    return await this.store.has(origin)
	  }

	  async list() {
	    return Array.from(await this.store.values()).sort((a, b) => {
	      return b.accessedAt - a.accessedAt
	    })
	  }

	  async clearConnections() {
	    const origins = await this.list();
	    for (const { origin } of origins) {
	      this._emitter.emit('delete', { origin });
	    }
	    await this.store.clear();
	    await this.index.clear();
	  }

	  async delete(origin) {
	    const res = await this.store.delete(origin);

	    this._emitter.emit('delete', { origin });

	    return res
	  }

	  async get(origin) {
	    return await this.store.get(origin)
	  }

	  async isAllowed(origin, publicKey) {
	    const conn = await this.store.get(origin);
	    if (conn?.allowList == null) return false
	    const { allowList } = conn;

	    const explicitKey = allowList.publicKeys.includes(publicKey);
	    if (explicitKey) return true

	    const pkFromIndex = await this.index.get(publicKey);
	    if (pkFromIndex == null) return false

	    return allowList.wallets.includes(pkFromIndex.wallet)
	  }

	  async listAllowedKeys(origin) {
	    const conn = await this.store.get(origin);
	    if (conn?.allowList == null) return []

	    const { allowList } = conn;

	    const keysFromIndex = await this.index.values();
	    const keys = [];
	    for (const { publicKey, name, wallet } of keysFromIndex) {
	      if (allowList.wallets.includes(wallet)) {
	        keys.push({ publicKey, name });
	      }

	      if (allowList.publicKeys.includes(publicKey)) {
	        keys.push({ publicKey, name });
	      }
	    }

	    return keys
	  }

	  /**
	   * Get the chainId that was approved for a given origin on initial connection.
	   * The chainId should not be changed without user consent.
	   *
	   * @param {string} origin - The origin of the connection
	   * @returns {string | null} The chainId
	   */
	  async getChainId(origin) {
	    const conn = await this.store.get(origin);
	    if (conn == null) return null

	    return conn.chainId ?? null
	  }

	  /**
	   * Get the networkId that was approved for a given origin on initial connection.
	   * The networkId is only facing the extension and references a specific
	   * network configuration.
	   *
	   * @param {string} origin - The origin of the connection
	   * @returns {string | null} The networkId
	   */
	  async getNetworkId(origin) {
	    const conn = await this.store.get(origin);
	    if (conn == null) return null

	    return conn.networkId ?? null
	  }
	}

	class PortServer {
	  /**
	   * PortServer handles JSONRPCServer requests from a MessagePort as a FIFO queue.
	   * Multiple ports can be listened to at once, each getting their own queue.
	   * Each queue is processed sequentially, only allowing a single in-flight message at a time.
	   * Request handlers are passed the validated JSON RPC message and a context object containing the port and origin.
	   * Additional metadata can be assigned to the context object. The context object is unique to each port and persistent.
	   *
	   * @constructor
	   * @param {object} opts
	   * @param {function} opts.onconnect - global connect handler
	   * @param {function} opts.onerror - global error handler
	   * @param {JSONRPCServer} opts.server - JSONRPCServer instance
	   */
	  constructor ({ onconnect = () => {}, onerror = (_) => {}, server }) {
	    this.onerror = onerror;
	    this.onconnect = onconnect;
	    this.server = server;

	    this.server.listenNotifications((msg) => {
	      this.ports.forEach((_, port) => port.postMessage(msg));
	    });

	    // Map<Port, context>
	    this.ports = new Map();
	  }

	  /**
	   * Disconnect all ports matching the origin. If origin is '*', all ports are disconnected.
	   * @param {string} origin
	   * @returns {void}
	   */
	  disconnect (origin) {
	    for (const [port, context] of this.ports.entries()) {
	      if (origin === '*' || context.origin === origin) {
	        port.disconnect();
	      }
	    }
	  }

	  /**
	   * Broadcast a message to all ports matching the origin. If origin is '*', all ports are broadcasted to.
	   * @param {string} origin
	   * @param {object} message
	   * @returns {void}
	   */
	  broadcast (origin, message) {
	    for (const [port, context] of this.ports.entries()) {
	      if (origin === '*' || context.origin === origin) {
	        port.postMessage(message);
	      }
	    }
	  }

	  /**
	   * Listen to a MessagePort
	   * @param {Port} port
	   * @returns {void}
	   */
	  listen (port) {
	    const self = this;

	    const origin = port.sender && (port.sender.url ? new URL(port.sender.url).origin : port.sender.id);
	    const messageQueue = [];
	    let busy = false;

	    const context = { port, origin };

	    this.ports.set(port, context);

	    const onconnect = this.onconnect(context);

	    port.onMessage.addListener(_onmessage);
	    port.onDisconnect.addListener(_ondisconnect);

	    async function _onmessage (message) {
	      await onconnect;

	      // Ensure the port is still connected
	      if (self.ports.has(port) === false) return

	      // Append a message to the queue and
	      // kick off the processing loop if idle
	      messageQueue.push(message);

	      if (busy === false) _process();
	    }

	    function _process () {
	      const req = messageQueue.shift();
	      if (req == null) return
	      busy = true;

	      self.server
	        .onrequest(req, context)
	        .then((res) => {
	          // notification
	          if (res == null) return

	          // Client disconnected
	          if (self.ports.has(port) === false) return

	          port.postMessage(res);
	        })
	        .catch(self.onerror)
	        .finally(() => {
	          busy = false;
	          _process();
	        });
	    }

	    function _ondisconnect (port) {
	      port.onMessage.removeListener(_onmessage);
	      port.onDisconnect.removeListener(_ondisconnect);

	      assert$r(self.ports.delete(port), 'Removed unknown port. Possible leak');
	    }
	  }
	}

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

	/**
	 * Popup client
	 * @constructor
	 * @param {object} opts Options note that onbeforerequest and onafterrequest will not be called if the method is "ping"
	 */
	class PopupClient {
	  constructor({ onbeforerequest, onafterrequest }) {
	    this.onbeforerequest = onbeforerequest;
	    this.onafterrequest = onafterrequest;

	    this.ports = new Set();
	    this.persistentQueue = [];

	    this.client = new JSONRPCClient({
	      idPrefix: 'background-',
	      send: (msg) => {
	        this.persistentQueue.push(msg);
	        this.ports.forEach((p) => p.postMessage(msg));
	      }
	    });
	  }

	  totalPending() {
	    return this.persistentQueue.length
	  }

	  reviewConnection(params) {
	    return this._send('popup.review_connection', params)
	  }

	  reviewTransaction(params) {
	    return this._send('popup.review_transaction', params)
	  }

	  async _send(method, params) {
	    const res = this.client.request(method, params);
	    // Wait for the request to be added to the send queue
	    this.onbeforerequest?.();

	    return res
	  }

	  async connect(port) {
	    this.ports.add(port);

	    port.onMessage.addListener(_onmessage);
	    port.onDisconnect.addListener(_ondisconnect);

	    // Send all pending messages
	    for (const msg of this.persistentQueue) {
	      port.postMessage(msg);
	    }

	    const self = this;
	    function _onmessage(message) {
	      if (isResponse(message)) {
	        const idx = self.persistentQueue.findIndex((msg) => msg.id === message.id);
	        if (idx !== -1) {
	          self.persistentQueue.splice(idx, 1);
	        }
	      }

	      self.client.onmessage(message);

	      if (isResponse(message)) {
	        self.onafterrequest?.();
	      }
	    }

	    function _ondisconnect(port) {
	      port.onMessage.removeListener(_onmessage);
	      port.onDisconnect.removeListener(_ondisconnect);

	      assert$r(self.ports.delete(port), 'Removed unknown port. Possible leak');
	    }
	  }
	}

	const CONSTANTS = {
	  width: 360,
	  defaultHeight: 600
	};

	const windows$1 = globalThis.browser?.windows ?? globalThis.chrome?.windows;
	const runtime$3 = globalThis.browser?.runtime ?? globalThis.chrome?.runtime;

	const BUFFER_HEIGHT = 30;

	const createWindow = (top = undefined, left = undefined, once = false) => {
	  const url = once ? 'index.html?once=1' : 'index.html';
	  return windows$1.create({
	    url: runtime$3.getURL(url),
	    type: 'popup',
	    focused: true,
	    // Approximate dimension. The client figures out exactly how big it should be as this height/width
	    // includes the frame and different OSes have different sizes
	    width: CONSTANTS.width,
	    height: CONSTANTS.defaultHeight + BUFFER_HEIGHT,
	    top,
	    left
	  })
	};

	const createNotificationWindow = async () => {
	  let left = 0;
	  let top = 0;
	  try {
	    const lastFocused = await windows$1.getLastFocused();
	    top = lastFocused.top;
	    left = lastFocused.left + (lastFocused.width - CONSTANTS.width);
	  } catch (_) {}

	  return createWindow(top, left, true)
	};

	const mockPort = 9090;

	const mainnet = {
	  color: '#000000',
	  secondaryColor: '#FFFFFF',
	  id: 'mainnet',
	  name: 'Mainnet',
	  chainId: 'vega-mainnet-0011',
	  hidden: false,
	  rest: [
	    'https://vega-mainnet-data.commodum.io',
	    'https://vega-data.nodes.guru:3008',
	    'https://vega-data.bharvest.io',
	    'https://datanode.vega.pathrocknetwork.org',
	    'https://vega.aurora-edge.com',
	    'https://darling.network',
	    'https://rest.velvet.tm.p2p.org',
	    'https://vega-rest.mainnet.lovali.xyz',
	    'https://graphqlvega.gpvalidator.com',
	    'https://vega-mainnet.anyvalid.com',
	    'https://vega.mainnet.stakingcabin.com:3008'
	  ],
	  console: 'https://console.vega.xyz',
	  ethereumExplorerLink: 'https://etherscan.io',
	  explorer: 'https://explorer.vega.xyz',
	  governance: 'https://governance.vega.xyz',
	  docs: 'https://docs.vega.xyz/mainnet/concepts/new-to-vega',
	  vegaDapps: 'https://vega.xyz/apps'
	};

	const fairground = {
	  color: '#D7FB50',
	  secondaryColor: '#000000',
	  id: 'fairground',
	  name: 'Fairground',
	  chainId: 'vega-fairground-202305051805',
	  hidden: false,
	  rest: [
	    'https://api.n00.testnet.vega.rocks',
	    'https://api.n06.testnet.vega.rocks',
	    'https://api.n07.testnet.vega.rocks',
	    'https://api.n08.testnet.vega.rocks',
	    'https://api.n09.testnet.vega.rocks'
	  ],
	  console: 'https://console.fairground.wtf',
	  ethereumExplorerLink: 'https://sepolia.etherscan.io',
	  explorer: 'https://explorer.fairground.wtf',
	  governance: 'https://governance.fairground.wtf',
	  docs: 'https://docs.vega.xyz/testnet/concepts/new-to-vega',
	  vegaDapps: 'https://vega.xyz/apps'
	};

	const devnet = {
	  color: '#00F780',
	  secondaryColor: '#FFFFFF',
	  id: 'devnet',
	  name: 'Devnet',
	  chainId: 'vega-devnet1-202401251038',
	  hidden: true,
	  rest: ['https://api.devnet1.vega.rocks', 'https://api.n06.devnet1.vega.rocks', 'https://api.n07.devnet1.vega.rocks'],
	  ethereumExplorerLink: 'https://sepolia.etherscan.io',

	  console: '',
	  explorer: '',
	  governance: '',

	  docs: 'https://docs.vega.xyz/testnet',
	  vegaDapps: 'https://vega.xyz/apps'
	};

	const stagnet1 = {
	  color: '#0075FF',
	  secondaryColor: '#FFFFFF',
	  id: 'stagnet1',
	  name: 'Stagnet 1',
	  chainId: 'vega-stagnet1-202307191148',
	  hidden: true,
	  rest: [
	    'https://api.stagnet1.vega.rocks',
	    'https://api.n05.stagnet1.vega.rocks',
	    'https://api.n06.stagnet1.vega.rocks'
	  ],
	  ethereumExplorerLink: 'https://sepolia.etherscan.io',

	  console: 'https://console.stagnet1.vega.rocks',
	  explorer: 'https://explorer.stagnet1.vega.rocks',
	  governance: 'https://governance.stagnet1.vega.rocks',

	  docs: 'https://docs.vega.xyz/testnet',
	  vegaDapps: 'https://vega.xyz/apps'
	};

	const mirror = {
	  color: '#FF077F',
	  secondaryColor: '#FFFFFF',
	  id: 'mainnet-mirror',
	  name: 'Mainnet Mirror',
	  chainId: 'vega-mainnet-mirror-202306231148',
	  hidden: true,
	  rest: ['https://api.mainnet-mirror.vega.rocks', 'https://api.n06.mainnet-mirror.vega.rocks'],
	  ethereumExplorerLink: 'https://sepolia.etherscan.io',

	  console: 'https://console.mainnet-mirror.vega.rocks',
	  explorer: 'https://explorer.mainnet-mirror.vega.rocks',
	  governance: 'https://governance.mainnet-mirror.vega.rocks',

	  docs: 'https://docs.vega.xyz/testnet',
	  vegaDapps: 'https://vega.xyz/apps'
	};

	const validatorTestnet = {
	  color: '#8028FF',
	  secondaryColor: '#FFFFFF',
	  id: 'validator-testnet',
	  name: 'Validator Testnet',
	  chainId: 'vega-testnet-0002-v4',
	  hidden: true,
	  rest: [
	    'https://rest.venom.tm.p2p.org',
	    'https://vega-testnet.anyvalid.com',
	    'https://testnet.vega.xprv.io/datanode',
	    'https://vega-testnet.nodes.guru:3008',
	    'https://testnet.vega.greenfield.xyz',
	    'https://vega-testnet-data.commodum.io',
	    'https://vega-rest.testnet.lovali.xyz',
	    'https://vega-test-data.bharvest.io:3009'
	  ],
	  ethereumExplorerLink: 'https://sepolia.etherscan.io',

	  console: 'https://console..validator-testnet.vega.rocks',
	  explorer: 'https://explorer..validator-testnet.vega.rocks',
	  governance: 'https://governance..validator-testnet.vega.rocks',

	  docs: 'https://docs.vega.xyz/testnet',
	  vegaDapps: 'https://vega.xyz/apps'
	};

	({
	  ...fairground,
	  id: 'test',
	  name: 'Test',
	  chainId: 'test-chain-id',
	  rest: [`http://localhost:${mockPort}`]
	});

	const testnet = {
	  title: 'Vega Wallet - Beta',
	  defaultNetworkId: fairground.id,
	  defaultChainId: fairground.chainId,
	  networks: [
	    mainnet,
	    fairground,
	    devnet,
	    stagnet1,
	    mirror,
	    validatorTestnet
	  ],
	  feedbackLink: 'https://github.com/vegaprotocol/feedback/discussions',
	  encryptionSettings: undefined,
	  closeWindowOnPopupOpen: true,
	  userDataPolicy: 'https://vega.xyz/vega-wallet-user-data-policy/',
	  sentryDsn: 'https://7f7577b2eefe43a58dc25d2eda9b1a74@o286262.ingest.sentry.io/4505199579758592',
	  logging: false,
	  features: {
	    popoutHeader: true
	  },
	  manifestReplacements: {
	    buildName: 'Beta',
	    geckoId: 'browser-extension@vega.xyz',
	    iconPrefix: 'Beta'
	  },
	  autoOpenOnInstall: true
	};

	const createConnectionHandler = (clientPorts, popupPorts, interactor) => async (port) => {
	  if (port.name === 'content-script') return clientPorts.listen(port)
	  if (port.name === 'popup') {
	    popupPorts.listen(port);
	    interactor.connect(port);
	  }
	};

	const createOnInstalledListener = (networks, settings, connections) => async (details) => {
	  const { reason } = details;
	  if (reason === 'install') {
	    await install({ networks, settings });

	    {
	      createWindow();
	    }
	  }

	  if (reason === 'update') {
	    await update({ settings, networks, connections });
	  }
	};

	async function install({ networks, settings }) {
	  await Promise.allSettled([
	    ...testnet.networks.map((network) => networks.set(network.id, network)),
	    settings.set('selectedNetwork', testnet.defaultNetworkId),
	    settings.set('autoOpen', true),
	    settings.set('showHiddenNetworks', false),
	    settings.set('version', migrations.length)
	  ]);
	}

	const migrations = [
	  // The first migration is due to the introduction of autoOpen in 0.11.0,
	  // however, we failed to test updates in CI.
	  async function v1({ settings }) {
	    await settings.transaction(async (store) => {
	      if ((await store.get('autoOpen')) == null) await store.set('autoOpen', true);

	      await store.set('version', 1);
	    });
	  },

	  // The second migration is modifying the network structure,
	  // introducing a fixed chainId, and tying a connection to a specific
	  // chainId (with a preferred networkId).
	  async function v2({ settings, networks, connections }) {
	    await settings.transaction(async (store) => {
	      const defaultNetworkId = testnet.defaultNetworkId;
	      const defaultChainId = testnet.defaultChainId;

	      await store.set('selectedNetwork', defaultNetworkId);

	      // populate all networks
	      await networks.store.clear();
	      for (const network of testnet.networks) {
	        await networks.set(network.id, network);
	      }

	      // update all connections to have default values for chainId and networkId
	      for (const [origin, connection] of await connections.store.entries()) {
	        connection.chainId = defaultChainId;
	        connection.networkId = defaultNetworkId;

	        await connections.store.set(origin, connection);
	      }

	      await store.set('version', 2);
	    });
	  },

	  // The third migration is modifying the network structure,
	  // adding a color to it
	  async function v3({ settings, networks }) {
	    await settings.transaction(async (store) => {
	      // repopulate all networks
	      await networks.store.clear();
	      for (const network of testnet.networks) {
	        await networks.set(network.id, network);
	      }
	      await store.set('version', 3);
	      await store.set('showHiddenNetworks', false);
	    });
	  }
	];

	// Migration function, add more dependencies as needed for migrations
	async function update(stores) {
	  const previousVersion = (await stores.settings.get('version')) ?? 0;
	  for (let i = previousVersion; i < migrations.length; i++) {
	    await migrations[i](stores);
	  }
	}

	const setupListeners = (runtime, networks, settings, clientPorts, popupPorts, interactor, connections) => {
	  const installListener = createOnInstalledListener(networks, settings, connections);
	  runtime.onInstalled.addListener(installListener);

	  const connectionListener = createConnectionHandler(clientPorts, popupPorts, interactor);
	  runtime.onConnect.addListener(connectionListener);
	};

	const extensionStorage = (globalThis?.browser ?? globalThis?.chrome)?.storage;

	function abstractStorage (storage) {
	// Based on https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea
	  return class AbstractStorage {
	    static isSupported () {
	      return storage != null
	    }

	    // Scary name
	    static async permanentClearAll () {
	      return storage.clear()
	    }

	    constructor (prefix) {
	      this._prefix = prefix;
	      if (AbstractStorage.isSupported() !== true) {
	        throw new Error('Unsupported storage runtime')
	      }
	    }

	    async _load () {
	      return (await storage.get(this._prefix))?.[this._prefix] ?? {}
	    }

	    async has (key) {
	      return (await this._load())[key] !== undefined
	    }

	    async get (key) {
	      const val = await this._load();
	      return val[key]
	    }

	    async set (key, value) {
	      const val = await this._load();
	      val[key] = value;
	      await storage.set({
	        [this._prefix]: val
	      });
	      return this
	    }

	    async delete (key) {
	      const val = await this._load();
	      const hadKey = val[key] != null;
	      if (hadKey) {
	        delete val[key];
	        await storage.set({
	          [this._prefix]: val
	        });
	      }
	      return hadKey
	    }

	    async clear () {
	      await storage.remove(this._prefix);
	    }

	    async keys () {
	      return Object.keys(await this._load())
	    }

	    async values () {
	      return Object.values(await this._load())
	    }

	    async entries () {
	      return Object.entries(await this._load())
	    }
	  }
	}

	class StorageLocalMap extends abstractStorage(extensionStorage?.local) {}
	class StorageSessionMap extends abstractStorage(extensionStorage?.session) {}

	var compare = function (a, b) {
	  return a < b ? -1 : a > b ? 1 : 0
	};

	var compare$1 = /*@__PURE__*/getDefaultExportFromCjs(compare);

	const KEY_ALGORITHM = 'argon2id';
	const KEY_VERSION = 0x13;

	async function deriveKey (passphrase, salt, iterations, memory) {
	  assert$r(passphrase instanceof Uint8Array);
	  assert$r(salt instanceof Uint8Array);
	  assert$r(iterations > 0);
	  assert$r(memory > 0);

	  return (await wasm).argon2id_kdf(passphrase, salt, iterations, memory)
	}

	async function generateSalt () {
	  return await randomFill(new Uint8Array(16))
	}

	async function deriveSIV (key, plaintext) {
	  assert$r(key instanceof Uint8Array);
	  assert$r(plaintext instanceof Uint8Array);

	  const tmp = concat(key, plaintext);
	  const digest = await sha256(tmp);
	  tmp.fill(0);

	  return digest
	}

	function encodeAad (obj) {
	  const entries = Array.from(Object.entries(obj));
	  // Sort by key
	  entries.sort(([a], [b]) => compare$1(a, b));

	  return string$1E(JSON.stringify(entries))
	}

	async function encrypt (passpharse, plaintext, kdfParams = {}) {
	  assert$r(passpharse instanceof Uint8Array);
	  assert$r(plaintext instanceof Uint8Array);

	  kdfParams.iterations ??= 5;
	  kdfParams.memory ??= 64000;

	  assert$r(kdfParams.iterations > 0);
	  assert$r(kdfParams.memory > 0);

	  kdfParams.version ??= KEY_VERSION;
	  kdfParams.algorithm ??= KEY_ALGORITHM;

	  assert$r(kdfParams.version === KEY_VERSION);
	  assert$r(kdfParams.algorithm === KEY_ALGORITHM);

	  const salt = await generateSalt();
	  const key = await deriveKey(passpharse, salt, kdfParams.iterations, kdfParams.memory);
	  const aad = encodeAad(kdfParams);
	  const iv = await deriveSIV(key, salt);
	  const ciphertext = await aes256gcmEncrypt(key, iv, plaintext, aad);

	  return { ciphertext, salt, kdfParams }
	}

	async function decrypt (passphrase, ciphertext, salt, kdfParams) {
	  assert$r(passphrase instanceof Uint8Array);
	  assert$r(ciphertext instanceof Uint8Array);
	  assert$r(salt instanceof Uint8Array);

	  const aad = encodeAad(kdfParams);
	  const key = await deriveKey(passphrase, salt, kdfParams.iterations, kdfParams.memory);
	  const iv = await deriveSIV(key, salt);
	  const plaintext = await aes256gcmDecrypt(key, iv, ciphertext, aad);

	  return plaintext
	}

	class EncryptedStorage {
	  constructor(storage, kdfSettings = undefined) {
	    this._storage = storage;

	    this._kdfSettings = kdfSettings;

	    /**
	     * The passphrase used to encrypt the storage.
	     * This is stored in memory and cleared when the storage is closed.
	     * @type {Uint8Array}
	     * @private
	     */
	    this._passphrase = null;

	    /**
	     * An in-memory cache of the decrypted storage.
	     * @type {Map}
	     * @private
	     */
	    this._cache = null

	      // mutators
	      ;['set', 'delete', 'clear'].forEach((method) => {
	        this[method] = async (...args) => {
	          if (this.isLocked) {
	            throw new Error('Storage is locked')
	          }

	          const result = await this._cache[method](...args);

	          await this._save();

	          return result
	        };
	      })

	      // accessors
	      ;['get', 'has', 'entries', 'keys', 'values'].forEach((method) => {
	        this[method] = async (...args) => {
	          if (this.isLocked) {
	            throw new Error('Storage is locked')
	          }

	          return this._cache[method](...args)
	        };
	      });
	  }

	  get isLocked() {
	    return this._passphrase == null
	  }

	  /**
	   * Save the current state of the cached in-memory storage to the underlying encrypted storage.
	   * @returns {Promise<void>}
	   * @private
	   */
	  async _save() {
	    const plaintext = string$1E(JSON.stringify(Array.from(this._cache.entries())));
	    const { ciphertext, salt, kdfParams } = await encrypt(this._passphrase, plaintext, this._kdfSettings);

	    await Promise.all([
	      this._storage.set('ciphertext', toBase64(ciphertext)),
	      this._storage.set('salt', toBase64(salt)),
	      this._storage.set('kdfParams', kdfParams)
	    ]);
	  }

	  /**
	   * Load the encrypted storage and decrypt into the cached in-memory storage.
	   * @returns {Promise<Array>}
	   * @private
	   */
	  async _load() {
	    const [ciphertext, salt, kdfParams] = await Promise.all([
	      this._storage.get('ciphertext'),
	      this._storage.get('salt'),
	      this._storage.get('kdfParams')
	    ]);

	    if (ciphertext == null || salt == null || kdfParams == null) {
	      return []
	    }

	    try {
	      const plaintext = await decrypt(this._passphrase, base64(ciphertext), base64(salt), kdfParams);
	      return JSON.parse(toString(plaintext))
	    } catch (err) {
	      const isOperationError = err.name === 'OperationError';
	      const isInvalidState = err.message === 'Unsupported state or unable to authenticate data';

	      if (isOperationError || isInvalidState) {
	        throw new Error('Invalid passphrase or corrupted storage')
	      }

	      throw err
	    }
	  }

	  /**
	   * Verify that the given passphrase is equal to the one used to encrypt the storage.
	   * @param {string} passphrase - The passphrase to verify.
	   * @returns {Promise<boolean>} - Whether the passphrase is valid.
	   */
	  async verifyPassphrase(passphrase) {
	    if (this.isLocked) {
	      throw new Error('Storage is locked')
	    }

	    const passphraseBuf = string$1E(passphrase);
	    // TODO: This is def not constant time
	    if (passphraseBuf.byteLength !== this._passphrase.byteLength) return false

	    // TODO: Should we instead store a derived value in memory?
	    // TODO: This may not be constant time, but does it matter?
	    return passphraseBuf.every((b, i) => b === this._passphrase[i])
	  }

	  /**
	   * Change the passphrase used to encrypt the storage.
	   * @param {string} oldPassphrase - The current passphrase.
	   * @param {string} newPassphrase - The new passphrase.
	   * @returns {Promise<EncryptedStorage>} - The storage instance.
	   */
	  async changePassphrase(oldPassphrase, newPassphrase) {
	    if (this.isLocked) {
	      throw new Error('Storage is locked')
	    }

	    if (!(await this.verifyPassphrase(oldPassphrase))) {
	      throw new Error('Invalid passphrase')
	    }

	    this._passphrase = string$1E(newPassphrase);
	    this._save();

	    return this
	  }

	  /**
	   * Check if the encrypted storage exists and is populated.
	   * @returns {Promise<boolean>} - Whether the storage exists and is populated.
	   */
	  async exists() {
	    return Array.from(await this._storage.entries()).length > 0
	  }

	  /**
	   * Create a new encrypted storage.
	   * @param {string} passphrase - The passphrase to use for encryption.
	   * @param {boolean} [overwrite=false] - Whether to overwrite an existing storage.
	   * @returns {Promise<EncryptedStorage>} - The storage instance.
	   */
	  async create(passphrase, overwrite = false) {
	    if (overwrite === false && (await this.exists())) {
	      throw new Error('Storage already exists')
	    }

	    // clear any existing state
	    if (this._passphrase) this._passphrase.fill(0);
	    this._passphrase = string$1E(passphrase);
	    this._cache = new Map();
	    await this._save();

	    return this
	  }

	  /**
	   * Open the encrypted storage and decrypt into the in-memory cache.
	   * If no storage exists, this creates a new one on the first save.
	   * @param {string} passphrase - The passphrase to use for encryption.
	   * @returns {Promise<EncryptedStorage>} - The storage instance.
	   */
	  async unlock(passphrase) {
	    this._passphrase = string$1E(passphrase);
	    this._cache = new Map(await this._load());

	    return this
	  }

	  /**
	   * Close the encrypted storage, saving and clearing the in-memory cache and passphrase.
	   * @returns {Promise<void>}
	   */
	  async lock() {
	    if (this.isLocked) return null

	    await this._save();
	    this._cache = null;
	    this._passphrase.fill(0);
	    this._passphrase = null;
	    return
	  }
	}

	const Seconds = 1000;
	const Minutes = 60 * Seconds;

	/**
	 * Default caching strategy (ie. the concrete implementation for the browser wallet)
	 *
	 * We cache:
	 *  - Markets for 30 Minutes
	 *  - Assets for 30 Minutes
	 *  - Everything else is not cached
	 *
	 * New endpoints can be added to the switch statement, while more advanched caching strategies
	 * can be implemented based on the value (eg. a position that expires or something)
	 *
	 * @param {string} key
	 * @param {Object} value
	 * @returns {number} TTL in milliseconds
	 */
	function vegaCachingStrategy(key, value) {
	  const url = new URL(key, 'https://localhost'); // adding a random domain to make a valid URL

	  switch (url.pathname) {
	    case '/api/v2/markets':
	      return 30 * Minutes
	    case '/api/v2/assets':
	      return 30 * Minutes
	    default:
	      return 0
	  }
	}

	class FetchCache {
	  /**
	   * @param {AsyncMap} storage
	   * @param {Function} ttlFn Function that returns the TTL for a given key and value
	   * @returns {FetchCache}
	   */
	  constructor(storage, ttlFn = vegaCachingStrategy) {
	    /**
	     * @private
	     */
	    this._cache = storage;

	    /**
	     * @private
	     */
	    this._ttlFn = ttlFn;
	  }

	  /**
	   * @private
	   * @param {string} path The path to cache
	   * @param {string} networkId The id of the network we are requesting the data from
	   * @returns {string} The combined path and networkId cache key
	   */
	  _getCacheKey(path, networkId) {
	    return `${networkId}:${path}`
	  }

	  /**
	   * @param {string} path
	   * @param {string} networkId
	   * @returns {Promise<boolean>}
	   */
	  async has(path, networkId) {
	    const key = this._getCacheKey(path, networkId);
	    await this._gc();

	    return this._cache.has(key)
	  }

	  /**
	   * @param {string} path
	   * @returns {Promise<Object> | Promise<undefined>}
	   */
	  async get(path, networkId) {
	    await this._gc();
	    const key = this._getCacheKey(path, networkId);

	    const value = await this._cache.get(key);
	    if (!value) return undefined

	    return decompress(value.value)
	  }

	  /**
	   * @param {string} path
	   * @param {string} networkId
	   * @param {Object} value
	   * @returns {Promise<void>}
	   */
	  async set(path, networkId, value) {
	    const key = this._getCacheKey(path, networkId);

	    const ttl = this._ttlFn(path, value) ?? 0;
	    if (ttl === 0) return

	    const _value = await compress(value); // save space
	    await this._cache.set(key, { value: _value, ttl: Date.now() + ttl });
	  }

	  async _gc() {
	    await Promise.all(
	      Array.from(await this._cache.entries(), async ([key, value]) => {
	        if (value.ttl < Date.now()) {
	          await this._cache.delete(key);
	        }
	      })
	    );
	  }
	}

	/**
	 * Compress a JSON serializable object to a base64 string using GZIP
	 *
	 * @param {Object} value
	 * @returns {Promise<string>}
	 */
	async function compress(value) {
	  const jsonString = JSON.stringify(value);

	  // Create a Blob so we can use web streams
	  const blob = new Blob([jsonString]);

	  // Compress the Blob data with GZIP
	  const compressedStream = blob.stream().pipeThrough(new CompressionStream('gzip'));

	  // Convert compressed stream to Uint8Array
	  const compressedData = await new Response(compressedStream).arrayBuffer();
	  const compressedUint8Array = new Uint8Array(compressedData);

	  // Convert compressed data to base64
	  return toBase64(compressedUint8Array)
	}

	/**
	 * Decompress a base64 string to a JSON serializable object using GZIP
	 * @param {string} base64String
	 * @returns {Promise<Object>}
	 */
	async function decompress(base64String) {
	  // Convert base64 string to Uint8Array
	  const binaryData = base64(base64String);

	  // Decompress data with GZIP
	  const decompressedStream = new Blob([binaryData]).stream().pipeThrough(new DecompressionStream('gzip'));

	  // Convert decompressed stream to text
	  const decompressedData = await new Response(decompressedStream).text();

	  return JSON.parse(decompressedData)
	}

	const Errors$1 = {
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
	    if (req == null || typeof req !== 'object') return { jsonrpc: '2.0', error: Errors$1.JSONRPC_PARSE_ERROR }

	    if (isNotification(req)) return this.onnotification(req.method, req.params, context)

	    // Ignore responses
	    if (isResponse(req)) return

	    if (!isRequest(req)) {
	      return {
	        jsonrpc: '2.0',
	        error: Errors$1.JSONRPC_INVALID_REQUEST,
	        id: req.id
	      }
	    }

	    const method = this._dispatch.get(req.method);
	    if (method == null) {
	      return {
	        jsonrpc: '2.0',
	        error: Errors$1.JSONRPC_METHOD_NOT_FOUND,
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
	        error: Errors$1.JSONRPC_INTERNAL_ERROR,
	        id: req.id
	      }
	    }
	  }
	}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$q(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(errors > 0){const emErrs0 = [];for(const err1 of vErrors){if(((((err1.keyword !== "errorMessage") && (!err1.emUsed)) && ((err1.instancePath === instancePath) || ((err1.instancePath.indexOf(instancePath) === 0) && (err1.instancePath[instancePath.length] === "/")))) && (err1.schemaPath.indexOf("#") === 0)) && (err1.schemaPath["#".length] === "/")){emErrs0.push(err1);err1.emUsed = true;}}if(emErrs0.length){const err2 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`admin.app_globals` does not take any parameters"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}const emErrs1 = [];for(const err3 of vErrors){if(!err3.emUsed){emErrs1.push(err3);}}vErrors = emErrs1;errors = emErrs1.length;}validate14$q.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$p(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){for(const key0 in data){if(!((((key0 === "telemetry") || (key0 === "autoOpen")) || (key0 === "selectedNetwork")) || (key0 === "showHiddenNetworks"))){const err0 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}}if(data.telemetry !== undefined){if(typeof data.telemetry !== "boolean"){const err1 = {instancePath:instancePath+"/telemetry",schemaPath:"#/properties/telemetry/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.autoOpen !== undefined){if(typeof data.autoOpen !== "boolean"){const err2 = {instancePath:instancePath+"/autoOpen",schemaPath:"#/properties/autoOpen/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.selectedNetwork !== undefined){if(typeof data.selectedNetwork !== "string"){const err3 = {instancePath:instancePath+"/selectedNetwork",schemaPath:"#/properties/selectedNetwork/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.showHiddenNetworks !== undefined){if(typeof data.showHiddenNetworks !== "boolean"){const err4 = {instancePath:instancePath+"/showHiddenNetworks",schemaPath:"#/properties/showHiddenNetworks/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}validate14$p.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$o(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.passphrase === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "passphrase"},message:"must have required property '"+"passphrase"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}for(const key0 in data){if(!(key0 === "passphrase")){const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.passphrase !== undefined){if(typeof data.passphrase !== "string"){const err2 = {instancePath:instancePath+"/passphrase",schemaPath:"#/properties/passphrase/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}}else {const err3 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}validate14$o.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$n(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.passphrase === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "passphrase"},message:"must have required property '"+"passphrase"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.newPassphrase === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "newPassphrase"},message:"must have required property '"+"newPassphrase"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}for(const key0 in data){if(!((key0 === "passphrase") || (key0 === "newPassphrase"))){const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.passphrase !== undefined){if(typeof data.passphrase !== "string"){const err3 = {instancePath:instancePath+"/passphrase",schemaPath:"#/properties/passphrase/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.newPassphrase !== undefined){if(typeof data.newPassphrase !== "string"){const err4 = {instancePath:instancePath+"/newPassphrase",schemaPath:"#/properties/newPassphrase/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}validate14$n.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$m(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.passphrase === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "passphrase"},message:"must have required property '"+"passphrase"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}for(const key0 in data){if(!(key0 === "passphrase")){const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.passphrase !== undefined){if(typeof data.passphrase !== "string"){const err2 = {instancePath:instancePath+"/passphrase",schemaPath:"#/properties/passphrase/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}}else {const err3 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}validate14$m.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$l(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}validate14$l.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$k(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}validate14$k.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$j(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}validate14$j.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$i(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.name === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}for(const key0 in data){if(!(key0 === "name")){const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.name !== undefined){if(typeof data.name !== "string"){const err2 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}}else {const err3 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}validate14$i.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$h(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.name === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.recoveryPhrase === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "recoveryPhrase"},message:"must have required property '"+"recoveryPhrase"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}for(const key0 in data){if(!((key0 === "name") || (key0 === "recoveryPhrase"))){const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.name !== undefined){if(typeof data.name !== "string"){const err3 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.recoveryPhrase !== undefined){if(typeof data.recoveryPhrase !== "string"){const err4 = {instancePath:instancePath+"/recoveryPhrase",schemaPath:"#/properties/recoveryPhrase/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}validate14$h.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$g(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(errors > 0){const emErrs0 = [];for(const err1 of vErrors){if(((((err1.keyword !== "errorMessage") && (!err1.emUsed)) && ((err1.instancePath === instancePath) || ((err1.instancePath.indexOf(instancePath) === 0) && (err1.instancePath[instancePath.length] === "/")))) && (err1.schemaPath.indexOf("#") === 0)) && (err1.schemaPath["#".length] === "/")){emErrs0.push(err1);err1.emUsed = true;}}if(emErrs0.length){const err2 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`admin.list_wallets` does not take any parameters"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}const emErrs1 = [];for(const err3 of vErrors){if(!err3.emUsed){emErrs1.push(err3);}}vErrors = emErrs1;errors = emErrs1.length;}validate14$g.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$f(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.wallet === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "wallet"},message:"must have required property '"+"wallet"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}for(const key0 in data){if(!((((key0 === "wallet") || (key0 === "name")) || (key0 === "metadata")) || (key0 === "options"))){const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.wallet !== undefined){if(typeof data.wallet !== "string"){const err2 = {instancePath:instancePath+"/wallet",schemaPath:"#/properties/wallet/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.name !== undefined){if(typeof data.name !== "string"){const err3 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.metadata !== undefined){let data2 = data.metadata;if(!(data2 && typeof data2 == "object" && !Array.isArray(data2))){const err4 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}if(data.options !== undefined){let data3 = data.options;if(data3 && typeof data3 == "object" && !Array.isArray(data3)){for(const key1 in data3){const err5 = {instancePath:instancePath+"/options",schemaPath:"#/properties/options/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}}else {const err6 = {instancePath:instancePath+"/options",schemaPath:"#/properties/options/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}}}else {const err7 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}validate14$f.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$e(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.wallet === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "wallet"},message:"must have required property '"+"wallet"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}for(const key0 in data){if(!(key0 === "wallet")){const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.wallet !== undefined){if(typeof data.wallet !== "string"){const err2 = {instancePath:instancePath+"/wallet",schemaPath:"#/properties/wallet/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}}else {const err3 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}if(errors > 0){const emErrs0 = [];for(const err4 of vErrors){if(((((err4.keyword !== "errorMessage") && (!err4.emUsed)) && ((err4.instancePath === instancePath) || ((err4.instancePath.indexOf(instancePath) === 0) && (err4.instancePath[instancePath.length] === "/")))) && (err4.schemaPath.indexOf("#") === 0)) && (err4.schemaPath["#".length] === "/")){emErrs0.push(err4);err4.emUsed = true;}}if(emErrs0.length){const err5 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`admin.list_keys` must only be given `wallet`"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}const emErrs1 = [];for(const err6 of vErrors){if(!err6.emUsed){emErrs1.push(err6);}}vErrors = emErrs1;errors = emErrs1.length;}validate14$e.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$d(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.passphrase === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "passphrase"},message:"must have required property '"+"passphrase"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.publicKey === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "publicKey"},message:"must have required property '"+"publicKey"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}for(const key0 in data){if(!((key0 === "passphrase") || (key0 === "publicKey"))){const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.passphrase !== undefined){if(typeof data.passphrase !== "string"){const err3 = {instancePath:instancePath+"/passphrase",schemaPath:"#/properties/passphrase/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.publicKey !== undefined){if(typeof data.publicKey !== "string"){const err4 = {instancePath:instancePath+"/publicKey",schemaPath:"#/properties/publicKey/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}validate14$d.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$c(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.passphrase === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "passphrase"},message:"must have required property '"+"passphrase"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.walletName === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "walletName"},message:"must have required property '"+"walletName"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}for(const key0 in data){if(!((key0 === "passphrase") || (key0 === "walletName"))){const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.passphrase !== undefined){if(typeof data.passphrase !== "string"){const err3 = {instancePath:instancePath+"/passphrase",schemaPath:"#/properties/passphrase/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.walletName !== undefined){if(typeof data.walletName !== "string"){const err4 = {instancePath:instancePath+"/walletName",schemaPath:"#/properties/walletName/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}validate14$c.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$b(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.name === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.publicKey === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "publicKey"},message:"must have required property '"+"publicKey"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}for(const key0 in data){if(!((key0 === "name") || (key0 === "publicKey"))){const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.name !== undefined){if(typeof data.name !== "string"){const err3 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.publicKey !== undefined){if(typeof data.publicKey !== "string"){const err4 = {instancePath:instancePath+"/publicKey",schemaPath:"#/properties/publicKey/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}validate14$b.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$a(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.publicKey === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "publicKey"},message:"must have required property '"+"publicKey"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.message === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "message"},message:"must have required property '"+"message"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}for(const key0 in data){if(!((key0 === "publicKey") || (key0 === "message"))){const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.publicKey !== undefined){if(typeof data.publicKey !== "string"){const err3 = {instancePath:instancePath+"/publicKey",schemaPath:"#/properties/publicKey/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.message !== undefined){if(typeof data.message !== "string"){const err4 = {instancePath:instancePath+"/message",schemaPath:"#/properties/message/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}validate14$a.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$9(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}validate14$9.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$8(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.origin === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "origin"},message:"must have required property '"+"origin"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}for(const key0 in data){if(!(key0 === "origin")){const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.origin !== undefined){if(typeof data.origin !== "string"){const err2 = {instancePath:instancePath+"/origin",schemaPath:"#/properties/origin/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}}else {const err3 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}validate14$8.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$7(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(errors > 0){const emErrs0 = [];for(const err1 of vErrors){if(((((err1.keyword !== "errorMessage") && (!err1.emUsed)) && ((err1.instancePath === instancePath) || ((err1.instancePath.indexOf(instancePath) === 0) && (err1.instancePath[instancePath.length] === "/")))) && (err1.schemaPath.indexOf("#") === 0)) && (err1.schemaPath["#".length] === "/")){emErrs0.push(err1);err1.emUsed = true;}}if(emErrs0.length){const err2 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`admin.open_popout` does not take any parameters"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}const emErrs1 = [];for(const err3 of vErrors){if(!err3.emUsed){emErrs1.push(err3);}}vErrors = emErrs1;errors = emErrs1.length;}validate14$7.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$6(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.path === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.networkId === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "networkId"},message:"must have required property '"+"networkId"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}for(const key0 in data){if(!((key0 === "path") || (key0 === "networkId"))){const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.path !== undefined){if(typeof data.path !== "string"){const err3 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.networkId !== undefined){if(typeof data.networkId !== "string"){const err4 = {instancePath:instancePath+"/networkId",schemaPath:"#/properties/networkId/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}validate14$6.errors = vErrors;return errors === 0;}

	var name = "vegawallet-browser";
	var version = "0.24.0";
	var license = "MIT";
	var type = "module";
	var dependencies = {
		"@types/object-hash": "^3.0.4",
		"@vegaprotocol/crypto": "0.11.0",
		"@vegaprotocol/enums": "^0.0.1",
		"@vegaprotocol/protos": "^0.13.0",
		"@vegaprotocol/rest-clients": "^0.0.5",
		"@vegaprotocol/tailwindcss-config": "^0.0.2",
		"@vegaprotocol/ui-toolkit": "0.12.6",
		"@vegaprotocol/utils": "^0.0.10",
		"bignumber.js": "^9.0.2",
		classnames: "^2.2.0",
		"date-fns": "^2.30.0",
		dotenv: "^16.3.1",
		immer: "^10.0.2",
		"is-mobile": "^4.0.0",
		"javascript-time-ago": "^2.5.9",
		lodash: "^4.17.21",
		mutexify: "^1.4.0",
		nanoassert: "^2.0.0",
		"object-hash": "^3.0.0",
		"protobuf-codec": "^1.0.6",
		react: "^18.2.0",
		"react-copy-to-clipboard": "^5.1.0",
		"react-dom": "^18.2.0",
		"react-hook-form": "7.39.1",
		"react-router-dom": "^6.10.0",
		"react-time-ago": "^7.2.1",
		tailwindcss: "^3.3.2",
		tldts: "^6.0.8",
		zustand: "^4.3.2",
		zxcvbn: "^4.4.2"
	};
	var scripts = {
		build: "rollup -c",
		"build:test-e2e": "yarn build --wallet-config=test",
		"build:dev": "yarn build --wallet-config=dev",
		"build:beta": "yarn build --wallet-config=beta",
		"build:mainstream": "yarn build --wallet-config=mainstream",
		"build:console:testnet": "yarn build --wallet-config=console-smoke-testnet",
		"build:console:mainnet": "yarn build --wallet-config=console-smoke-mainnet",
		"build:analyze": "NODE_ENV=production yarn build:mainstream --analyze",
		dev: "web-ext run --start-url=examples/sample-dapp/index.html",
		"dev:chrome": "yarn dev --source-dir=build/chrome --target=chromium",
		"dev:firefox": "yarn dev --source-dir=build/firefox --devtools --firefox=firefoxdeveloperedition",
		"dev:mobile:firefox": "web-ext run -t firefox-android --firefox-apk org.mozilla.fenix --source-dir=build/firefox",
		"docs:update-acs": "node ./scripts/update-ac-config.js",
		format: "prettier --check frontend specs examples",
		"format:write": "yarn format --write",
		lint: "eslint --ext js,ts,tsx frontend --max-warnings=0",
		"lint:write": "yarn lint --fix",
		"lint:mobile:firefox": "web-ext lint --source-dir=build/firefox",
		"test:backend": "jest --config=test/test-config/jest.config-backend.js -t --testPathIgnorePatterns='.*\\/generate-transactions\\.spec\\.ts'",
		"test:requests": "jest --config=test/test-config/jest.config-requests.js --testPathPattern='.*\\/generate-transactions\\.spec\\.ts'",
		"test:backend:ci": "yarn test:backend --coverage",
		"test:e2e": "jest ./test/e2e --config=test/test-config/jest.config-e2e.js --maxWorkers=1 --testPathIgnorePatterns='keep-alive.spec.ts'",
		"test:e2e:chrome": "BROWSER=chrome yarn test:e2e",
		"test:e2e:chrome:ci": "HEADLESS=true yarn test:e2e:chrome",
		"test:e2e:firefox": "BROWSER=firefox yarn test:e2e",
		"test:e2e:firefox:ci": "HEADLESS=true yarn test:e2e:firefox",
		"test:console": "jest ./test/console-smoke --config=test/test-config/jest.config-console-smoke.js --maxWorkers=1",
		"test:console:testnet": "ENV=testnet yarn test:console",
		"test:console:mainnet": "ENV=mainnet yarn test:console",
		"test:console:testnet:ci": "./.github/scripts/deployment/deploy_console.sh testnet && yarn test:console:testnet && ./.github/scripts/deployment/destroy_console.sh",
		"test:console:mainnet:ci": "./.github/scripts/deployment/deploy_console.sh mainnet && yarn test:console:mainnet && ./.github/scripts/deployment/destroy_console.sh",
		"test:e2e:chrome-upgrade": "jest ./test/upgrade-tests --config=test/test-config/jest.config-upgrade.js --maxWorkers=1",
		"test:resillience": "jest ./test/resillience-tests --config=test/test-config/jest.config-resillience.js --maxWorkers=1",
		"test:keepalive": "BROWSER=chrome jest ./test/e2e/keep-alive.spec.ts --config=test/test-config/jest.config-e2e.js --maxWorkers=1",
		"test:e2e:chrome-upgrade:ci": "./.github/scripts/upgrade-test-download-management/download_old_extension.sh && yarn test:e2e:chrome-upgrade && ./.github/scripts/upgrade-test-download-management/remove_old_extension.sh",
		"test:frontend": "jest --config=test/test-config/jest.config-ui.js",
		"test:frontend:ci": "yarn test:frontend --coverage",
		watch: "yarn build:dev -w",
		"update-protos": "yarn add @vegaprotocol/protos@latest && node ./scripts/update-transaction-validation.js && yarn build:beta"
	};
	var browserslist = {
		production: [
			"last 10 chrome version",
			"last 10 firefox version"
		],
		development: [
			"last 1 chrome version",
			"last 1 firefox version"
		],
		test: [
			"last 10 chrome version",
			"last 10 firefox version"
		]
	};
	var devDependencies = {
		"@babel/core": "^7.16.0",
		"@babel/plugin-syntax-flow": "^7.14.5",
		"@babel/plugin-transform-react-jsx": "^7.14.9",
		"@babel/preset-env": "^7.22.4",
		"@rollup/plugin-alias": "^5.0.0",
		"@rollup/plugin-commonjs": "^25.0.0",
		"@rollup/plugin-html": "^1.0.2",
		"@rollup/plugin-json": "^6.0.0",
		"@rollup/plugin-node-resolve": "^15.1.0",
		"@rollup/plugin-replace": "^5.0.2",
		"@rollup/plugin-terser": "^0.4.3",
		"@rollup/plugin-typescript": "^11.1.1",
		"@testing-library/dom": "^9.3.3",
		"@testing-library/jest-dom": "^5.16.5",
		"@testing-library/react": "^14.0.0",
		"@testing-library/user-event": "^13.5.0",
		"@types/archiver": "^5.3.2",
		"@types/chrome": "^0.0.231",
		"@types/fs-extra": "^11.0.1",
		"@types/jest": "^29.5.2",
		"@types/lodash": "^4.14.195",
		"@types/node": "^16.18.23",
		"@types/react": "^18.0.34",
		"@types/react-dom": "^18.0.11",
		"@types/selenium-webdriver": "^4.1.13",
		"@types/zxcvbn": "^4.4.1",
		"@vegaprotocol/types": "^0.0.3",
		ajv: "^8.12.0",
		"ajv-errors": "^3.0.0",
		archiver: "^5.3.1",
		autoprefixer: "^10.4.14",
		"csv-parser": "^3.0.0",
		deepmerge: "^4.3.1",
		eslint: "^8.1.0",
		"eslint-config-react-app": "^7.0.1",
		"eslint-plugin-simple-import-sort": "^10.0.0",
		"eslint-plugin-unicorn": "^49.0.0",
		"fs-extra": "^11.1.0",
		glob: "^10.2.7",
		jest: "^29.5.0",
		"jest-canvas-mock": "^2.5.1",
		"jest-environment-jsdom": "^29.5.0",
		"jest-expect-message": "^1.1.3",
		"jest-junit": "^16.0.0",
		"jest-webextension-mock": "^3.8.9",
		postcss: "^8.4.24",
		prettier: "^2.8.8",
		"resize-observer-polyfill": "^1.5.1",
		rollup: "^3.23.1",
		"rollup-plugin-copy": "^3.4.0",
		"rollup-plugin-postcss": "^4.0.2",
		"rollup-plugin-visualizer": "^5.9.2",
		"selenium-webdriver": "^4.8.2",
		"ts-jest": "^29.1.0",
		typescript: "^5.0.4",
		"web-ext": "^7.6.1",
		"web-vitals": "^2.1.4",
		"webextension-polyfill-ts": "^0.26.0"
	};
	var resolutions = {
		tslib: "^2.3.1"
	};
	var pkg = {
		name: name,
		version: version,
		"private": true,
		license: license,
		type: type,
		dependencies: dependencies,
		scripts: scripts,
		browserslist: browserslist,
		devDependencies: devDependencies,
		resolutions: resolutions
	};

	/**
	 * Initialise a keep-alive loop for manifest v3 extensions. For any other manifest version, a noop is returned,
	 * duck typing to the same function signature.
	 *
	 * @param {number} [sleep=45 * 60 * 1000] - The number of milliseconds to wait before stopping the keep-alive loop.
	 * @param {number} [ping=1000] - The number of milliseconds to wait between keep-alive heartbeats.
	 * @returns {function} - A function to call to keep the extension alive, by resetting the sleep timeout.
	 */
	function init$2 (sleep = 45 * 60 * 1000, ping = 1000) {
	  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime;
	  const isManifestV3 = runtime.getManifest().manifest_version === 3;
	  // Only applicable to manifest v3 (ie chromium based browsers)
	  // Other browsers will get a noop
	  if (isManifestV3 === false) return () => {}

	  // This timeout stops the keepAliveInterval. This will effectively
	  // put the extension to sleep after N minutes of inactivity.
	  let keepAliveTimeout;

	  // This interval sends a ping to the port every M seconds to
	  // prevent the extension from going to sleep.
	  let keepAliveInterval;

	  // Start the loop. This code is strongly inspired by Metamask's
	  // implementation: https://github.com/MetaMask/metamask-extension/blob/develop/app/scripts/contentscript.js#L133

	  /**
	   * The default function to call to send a ping to the port. This is only used if the fn passed to keepAlive
	   * is not a function. (ie. the legacy API)
	   * @param {MessagePort} port - The port to send the ping to.
	   * @returns {void}
	   */
	  const defaultFn = (port) => {
	    port.postMessage({ jsonrpc: '2.0', method: 'ping', params: null });
	  };

	  /**
	   * Reset the sleep and ping timeouts. You should call this function each time you interact with the
	   * extension in any way that the user expects it to be kept alive. Eg. when sending user initiated messages,
	   * when interacting with UI, etc.
	   *
	   * @param {Function|MessagePort} fn - The function to call to send a ping to the port. If this is not a function,
	   *                                   it is assumed to be a port and the defaultFn will be used.
	   * @returns {void}
	   */
	  return function keepAlive (fn) {
	    // Refresh the keepalive timeout
	    clearTimeout(keepAliveTimeout);
	    // Restart the keepalive interval
	    clearInterval(keepAliveInterval);

	    // If the fn is null, we cannot send a ping, so stop here
	    if (fn == null) return

	    // If the fn is not a function, we assume its a port per the lagacy API
	    if (typeof fn !== 'function') fn = defaultFn.bind(null, fn);

	    keepAliveTimeout = setTimeout(() => {
	      clearInterval(keepAliveInterval);
	      keepAliveInterval = null;
	      keepAliveTimeout = null;
	    }, sleep);

	    keepAliveInterval = setInterval(() => {
	      try {
	        fn();
	      } catch (error) {
	        // The fn failed, stop timers
	        clearInterval(keepAliveInterval);
	        clearTimeout(keepAliveTimeout);
	      }
	    }, ping);
	  }
	}

	const windows = globalThis.browser?.windows ?? globalThis.chrome?.windows;

	function doValidate$1(validator, params) {
	  if (!validator(params)) {
	    throw new JSONRPCServer.Error(
	      validator.errors[0].message,
	      1,
	      validator.errors.map((e) => e.message)
	    )
	  }
	}

	/**
	 * Initialise the admin namespace server. The stores passed should be low-level Map-like
	 * storage, as the internals of the implementation will wrap these to do encryption and
	 * prevent data-races
	 *
	 * @param {Store} settings Map-like implementation to store settings.
	 * @param {WalletCollection} wallets
	 * @param {NetworkCollection} networks
	 * @param {ConnectionCollection} connections
	 * @param {FetchCache} fetchCache
	 * @param {Function} onerror Error handler
	 * @returns {JSONRPCServer}
	 */
	function init$1({ encryptedStore, settings, wallets, networks, connections, fetchCache, onerror }) {
	  connections.on('set', (connection) => {
	    server.notify('admin.connections_change', {
	      add: [connection],
	      update: [],
	      delete: []
	    });
	  });

	  connections.on('delete', (connection) => {
	    server.notify('admin.connections_change', {
	      add: [],
	      update: [],
	      delete: [connection]
	    });
	  });

	  let handle = null;
	  if (windows) {
	    windows.onRemoved.addListener((windowId) => {
	      if (windowId === handle?.id) {
	        handle = null;
	      }
	    });
	  }
	  // This could potentially take a settings timeout for how long to keep the
	  // extension alive
	  // For now we keep the extension alive for 8 hours and ping every 20 seconds
	  // 8 hours as normal workday (putting the machine to sleep will delay timers and probably sleep anyway)
	  // 20 seconds as per chrome recommendation for something less than 30 seconds (sleep timeout)
	  const keepAlive = init$2(1000 * 60 * 60 * 8, 1000 * 20);
	  function keepAliveFn() {
	    const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime;
	    runtime.getPlatformInfo();
	  }

	  var server = new JSONRPCServer({
	    onerror,
	    methods: {
	      async 'admin.open_popout'(params) {
	        doValidate$1(validate14$7, params);
	        if (handle == null) {
	          const popout = await createWindow();

	          handle = await popout;
	        }

	        return null
	      },
	      async 'admin.app_globals'(params) {
	        doValidate$1(validate14$q, params);

	        const hasPassphrase = await encryptedStore.exists();
	        const isLocked = encryptedStore.isLocked === true;

	        if (isLocked === false) {
	          // kick keepalive loop
	          keepAlive(keepAliveFn);
	        }

	        // TODO this is kinda indeterminate, as we don't know if the storage is empty
	        const hasWallet = isLocked ? false : Array.from(await wallets.list()).length > 0;
	        return {
	          passphrase: hasPassphrase,
	          wallet: hasWallet,
	          // We don't consider the app locked if there is no passphrase
	          locked: hasPassphrase && isLocked,
	          version: pkg.version,

	          settings: Object.fromEntries(await settings.entries())
	        }
	      },

	      async 'admin.update_app_settings'(params) {
	        doValidate$1(validate14$p, params);
	        await settings.transaction(async (store) => {
	          for (const [key, value] of Object.entries(params)) {
	            await store.set(key, value);
	          }
	        });

	        return null
	      },

	      async 'admin.create_passphrase'(params) {
	        doValidate$1(validate14$o, params);

	        await encryptedStore.create(params.passphrase);

	        return null
	      },

	      async 'admin.update_passphrase'(params) {
	        doValidate$1(validate14$n, params);
	        if ((await encryptedStore.exists()) === false) throw new JSONRPCServer.Error('Encryption not initialised', 1)
	        try {
	          await encryptedStore.changePassphrase(params.passphrase, params.newPassphrase);
	        } catch (e) {
	          if (e.message === 'Invalid passphrase') throw new JSONRPCServer.Error('Invalid passphrase', 1)
	          throw e
	        }

	        return null
	      },

	      async 'admin.unlock'(params) {
	        doValidate$1(validate14$m, params);
	        if ((await encryptedStore.exists()) === false) throw new JSONRPCServer.Error('Encryption not initialised', 1)
	        try {
	          await encryptedStore.unlock(params.passphrase);
	          // start keepalive loop
	          keepAlive(keepAliveFn);
	        } catch (e) {
	          if (e.message === 'Invalid passphrase or corrupted storage') {
	            throw new JSONRPCServer.Error('Invalid passphrase or corrupted storage', 1)
	          }
	          throw e
	        }

	        return null
	      },

	      async 'admin.lock'(params) {
	        doValidate$1(validate14$l, params);
	        await encryptedStore.lock();

	        // stop keepalive loop
	        keepAlive(null);

	        return null
	      },

	      async 'admin.list_networks'(params) {
	        doValidate$1(validate14$k, params);
	        const nets = await networks.listNetworkDetails();
	        return { networks: nets }
	      },

	      async 'admin.generate_recovery_phrase'(params) {
	        doValidate$1(validate14$j, params);

	        return { recoveryPhrase: await wallets.generateRecoveryPhrase() }
	      },

	      async 'admin.delete_wallet'(params) {
	        doValidate$1(validate14$i, params);

	        try {
	          await wallets.store.delete(params.name);
	          await connections.clearConnections();
	        } catch (ex) {
	          throw new JSONRPCServer.Error(ex.message, 1)
	        }

	        return null
	      },

	      async 'admin.import_wallet'(params) {
	        doValidate$1(validate14$h, params);

	        try {
	          await wallets.import(params);
	        } catch (e) {
	          throw new JSONRPCServer.Error(e.message, 1)
	        }

	        return null
	      },

	      async 'admin.list_wallets'(params) {
	        doValidate$1(validate14$g, params);

	        return { wallets: await wallets.list() }
	      },

	      async 'admin.list_keys'(params) {
	        doValidate$1(validate14$e, params);

	        return { keys: Array.from(await wallets.listKeys(params)) }
	      },

	      async 'admin.generate_key'(params) {
	        doValidate$1(validate14$f, params);

	        return await wallets.generateKey(params)
	      },

	      async 'admin.export_key'(params) {
	        doValidate$1(validate14$d, params);

	        if ((await encryptedStore.verifyPassphrase(params.passphrase)) !== true)
	          throw new JSONRPCServer.Error('Invalid passphrase or corrupted storage', 1)

	        try {
	          return await wallets.exportKey({ publicKey: params.publicKey })
	        } catch (ex) {
	          throw new JSONRPCServer.Error(ex.message, 1)
	        }
	      },

	      async 'admin.export_recovery_phrase'(params) {
	        doValidate$1(validate14$c, params);
	        if ((await encryptedStore.verifyPassphrase(params.passphrase)) !== true)
	          throw new JSONRPCServer.Error('Invalid passphrase or corrupted storage', 1)
	        try {
	          return await wallets.exportRecoveryPhrase({ walletName: params.walletName })
	        } catch (ex) {
	          throw new JSONRPCServer.Error(ex.message, 1)
	        }
	      },

	      async 'admin.rename_key'(params) {
	        doValidate$1(validate14$b, params);

	        try {
	          return await wallets.renameKey(params)
	        } catch (ex) {
	          throw new JSONRPCServer.Error(ex.message, 1)
	        }
	      },

	      async 'admin.sign_message'(params) {
	        doValidate$1(validate14$a, params);

	        const key = await wallets.getKeypair({ publicKey: params.publicKey });
	        if (key == null) throw new JSONRPCServer.Error('Key not found', 1)

	        const { keyPair } = key;

	        const signature = await keyPair.sign(string$1E(params.message), null); // no chainId

	        return { signature: toBase64(signature) }
	      },

	      async 'admin.list_connections'(params) {
	        doValidate$1(validate14$9, params);

	        return { connections: await connections.list() }
	      },

	      async 'admin.remove_connection'(params) {
	        doValidate$1(validate14$8, params);

	        await connections.delete(params.origin);

	        return null
	      },

	      async 'admin.fetch'(params) {
	        doValidate$1(validate14$6, params);

	        try {
	          const network = await networks.getByNetworkId(params.networkId);
	          const rpc = await network.rpc();

	          const cached = await fetchCache.get(params.path, params.networkId);
	          if (cached) return cached

	          const res = await rpc.getJSON(params.path);

	          await fetchCache.set(params.path, params.networkId, res);

	          return res
	        } catch (ex) {
	          throw new JSONRPCServer.Error('Failed to fetch data', -1, ex.message)
	        }
	      }
	    }
	  });

	  return server
	}

	const assert$p = nanoassert;

	const wireTypes$1 = {
	  VARINT: 0,
	  BYTES: 2,
	  FIXED64: 1,
	  FIXED32: 5
	};

	const varint$1 = {
	  encode (
	    int,
	    buf = alloc(this, int),
	    byteOffset = 0
	  ) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    let o = byteOffset;
	    let n = BigInt(int);

	    while (n >= 128n) {
	      buf[o++] = Number((n & 0xffn) | 0b1000_0000n);
	      n >>= 7n;
	    }

	    buf[o++] = Number(n);

	    this.encode.bytes = o - byteOffset;
	    return buf.subarray(byteOffset, o)
	  },
	  encodeOversize (int, len, buf, byteOffset = 0) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    assert$p(len >= this.encodingLength(int), 'len does not fit int');
	    assert$p(buf.byteLength - byteOffset >= len, 'buf does not fit len');
	    let o = byteOffset;
	    const end = byteOffset + len - 1;

	    let n = BigInt(int);

	    while (o < end) {
	      buf[o++] = Number((n & 0xffn) | 0b1000_0000n);
	      n >>= 7n;
	    }

	    buf[o++] = Number(n);

	    this.encodeOversize.bytes = o - byteOffset;
	    return buf.subarray(byteOffset, o)
	  },
	  encodingLength (int) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    if (int <= 0xffff_ffff) return (9 * (32 - Math.clz32(Number(int))) + 64) / 64 | 0
	    const high = Number(BigInt(int) >> 32n);
	    return (9 * (32 - Math.clz32(high) + 32) + 64) / 64 | 0
	  },
	  MIN_VALUE: 0n,
	  MAX_VALUE: (1n << 64n) - 1n
	};

	const bytes$6 = {
	  encode (src, buf = alloc(this, src), byteOffset = 0) {
	    let o = byteOffset;
	    varint$1.encode(src.byteLength, buf, o);
	    o += varint$1.encode.bytes;
	    buf.set(src, o);
	    o += src.byteLength;
	    this.encode.bytes = o - byteOffset;
	    return buf.subarray(byteOffset, o)
	  },
	  encodingLength (src) {
	    return varint$1.encodingLength(src.byteLength) + src.byteLength
	  }
	};

	const tag$2 = {
	  encode (
	    fieldNumber,
	    wireType,
	    buf = alloc(this, fieldNumber),
	    byteOffset = 0
	  ) {
	    assert$p(fieldNumber > 0, 'fieldNumber must be greater than 0');
	    assert$p(fieldNumber <= tag$2.MAX_VALUE, 'fieldNumber exceeds MAX_VALUE');
	    const int = BigInt.asUintN(32, BigInt(fieldNumber)) << 3n | BigInt(wireType);
	    varint$1.encode(int, buf, byteOffset);
	    this.encode.bytes = varint$1.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength (fieldNumber) {
	    assert$p(fieldNumber > 0, 'fieldNumber must be greater than 0');
	    assert$p(fieldNumber <= tag$2.MAX_VALUE, 'fieldNumber exceeds MAX_VALUE');

	    return (9 * (32 - Math.clz32(Number(fieldNumber) << 3)) + 64) / 64 | 0
	  },
	  MIN_VALUE: 1n,
	  MAX_VALUE: (1n << 29n) - 1n
	};

	const string$1D = {
	  encode (str, buf = alloc(this, str), byteOffset = 0) {
	    assert$p(typeof str === 'string');
	    const src = utf8.decode(str);
	    bytes$6.encode(src, buf, byteOffset);
	    this.encode.bytes = bytes$6.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength (str) {
	    const len = [...str].length;

	    return varint$1.encodingLength(len) + len
	  }
	};

	const uint64$u = {
	  encode (uint, buf = alloc(this, uint), byteOffset = 0) {
	    assert$p(uint >= this.MIN_VALUE, 'uint exceeds MIN_VALUE');
	    assert$p(uint <= this.MAX_VALUE, 'uint exceeds MAX_VALUE');
	    const biguint = BigInt(uint);
	    varint$1.encode(BigInt.asUintN(64, biguint), buf, byteOffset);
	    this.encode.bytes = varint$1.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength (uint) {
	    assert$p(uint >= this.MIN_VALUE, 'uint exceeds MIN_VALUE');
	    assert$p(uint <= this.MAX_VALUE, 'uint exceeds MAX_VALUE');
	    return varint$1.encodingLength(uint)
	  },
	  MIN_VALUE: varint$1.MIN_VALUE,
	  MAX_VALUE: varint$1.MAX_VALUE
	};

	const int64$n = {
	  encode (int, buf = alloc(this, int), byteOffset = 0) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    const bigint = BigInt(int);
	    varint$1.encode(BigInt.asUintN(64, bigint), buf, byteOffset);
	    this.encode.bytes = varint$1.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength (int) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    return varint$1.encodingLength(BigInt.asUintN(64, BigInt(int)))
	  },
	  MIN_VALUE: -(1n << 63n),
	  MAX_VALUE: (1n << 63n) - 1n
	};

	const sint64$1 = {
	  encode (int, buf = alloc(this, int), byteOffset = 0) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    const bigint = BigInt(int);
	    varint$1.encode(BigInt.asUintN(64, (bigint << 1n) ^ (bigint >> 63n)), buf, byteOffset);
	    this.encode.bytes = varint$1.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength (int) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    const bigint = BigInt(int);
	    return varint$1.encodingLength((bigint << 1n) ^ (bigint >> 63n))
	  },
	  MIN_VALUE: -(1n << 63n),
	  MAX_VALUE: (1n << 63n) - 1n
	};

	const uint32$7 = {
	  encode (uint, buf = alloc(this, uint), byteOffset = 0) {
	    assert$p(uint >= this.MIN_VALUE, 'uint exceeds MIN_VALUE');
	    assert$p(uint <= this.MAX_VALUE, 'uint exceeds MAX_VALUE');
	    const bigint = BigInt(uint);
	    varint$1.encode(BigInt.asUintN(32, bigint), buf, byteOffset);
	    this.encode.bytes = varint$1.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength (uint) {
	    assert$p(uint >= this.MIN_VALUE, 'uint exceeds MIN_VALUE');
	    assert$p(uint <= this.MAX_VALUE, 'uint exceeds MAX_VALUE');
	    return varint$1.encodingLength(uint)
	  },
	  MIN_VALUE: 0,
	  MAX_VALUE: (1n << 32n) - 1n
	};

	const int32$1 = {
	  encode (int, buf = alloc(this, int), byteOffset = 0) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    const bigint = BigInt(int);
	    varint$1.encode(BigInt.asUintN(32, bigint), buf, byteOffset);
	    this.encode.bytes = varint$1.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength (int) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    return varint$1.encodingLength(BigInt.asUintN(32, BigInt(int)))
	  },
	  MIN_VALUE: -(1n << 31n),
	  MAX_VALUE: (1n << 31n) - 1n
	};

	const sint32$1 = {
	  encode (int, buf = alloc(this, int), byteOffset = 0) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    const bigint = BigInt(int);
	    varint$1.encode((bigint << 1n) ^ (bigint >> 31n), buf, byteOffset);
	    this.encode.bytes = varint$1.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength (int) {
	    assert$p(int >= this.MIN_VALUE, 'int exceeds MIN_VALUE');
	    assert$p(int <= this.MAX_VALUE, 'int exceeds MAX_VALUE');
	    const bigint = BigInt(int);
	    return varint$1.encodingLength((bigint << 1n) ^ (bigint >> 31n))
	  },
	  MIN_VALUE: -(1n << 31n),
	  MAX_VALUE: (1n << 31n) - 1n
	};

	const bool$7 = {
	  encode (val, buf = alloc(this), byteOffset = 0) {
	    varint$1.encode(val === true ? 1 : 0, buf, byteOffset);
	    this.encode.bytes = varint$1.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength () {
	    return 1
	  }
	};

	const double$5 = {
	  encode (val, buf = alloc(this), byteOffset = 0) {
	    _view$1(buf).setFloat64(val);
	    this.encode.bytes = 8;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength () {
	    return 8
	  }
	};

	const float$1 = {
	  encode (val, buf = alloc(this), byteOffset = 0) {
	    _view$1(buf).setFloat32(val);
	    this.encode.bytes = 4;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength () {
	    return 4
	  }
	};

	function _view$1 (bytes) {
	  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
	}

	const enumerable$q = {
	  encode (en, buf = alloc(this, en), byteOffset = 0) {
	    assert$p(en >= enumerable$q.MIN_VALUE, 'enum value exceeds MIN_VALUE');
	    assert$p(en <= enumerable$q.MAX_VALUE, 'enum value exceeds MAX_VALUE');

	    en = Number(en) >>> 0; // cast to uint32 for varint encoding
	    varint$1.encode(en, buf, byteOffset);
	    this.encode.bytes = varint$1.encode.bytes;
	    return buf.subarray(byteOffset, byteOffset + this.encode.bytes)
	  },
	  encodingLength (en) {
	    assert$p(en >= enumerable$q.MIN_VALUE, 'enum value exceeds MIN_VALUE');
	    assert$p(en <= enumerable$q.MAX_VALUE, 'enum value exceeds MAX_VALUE');
	    return varint$1.encodingLength(Number(en) >>> 0)
	  },
	  MIN_VALUE: -(1n << 31n),
	  MAX_VALUE: (1n << 31n) - 1n
	};

	const enc = new TextEncoder();
	const dec = new TextDecoder();

	function alloc (ctx, ...data) {
	  return new Uint8Array(ctx.encodingLength(...data))
	}

	const utf8 = {
	  encode (buf) { return dec.decode(buf) },
	  decode (str) { return enc.encode(str) }
	};

	var wireTypes_1 = {
	  wireTypes: wireTypes$1,
	  varint: varint$1,
	  bytes: bytes$6,
	  tag: tag$2,
	  string: string$1D,
	  int64: int64$n,
	  uint64: uint64$u,
	  sint64: sint64$1,
	  int32: int32$1,
	  uint32: uint32$7,
	  sint32: sint32$1,
	  bool: bool$7,
	  double: double$5,
	  float: float$1,
	  enumerable: enumerable$q,
	  utf8,
	  alloc
	};

	const { varint, tag: tag$1, uint64: uint64$t, bytes: bytes$5, uint32: uint32$6, wireTypes } = wireTypes_1;

	const PAGE_SIZE = 256;

	var writer = class Writer {
	  /**
	   *
	   * @param {number} [prealloc=256] Number of bytes to preallocate in the internal write buffer
	   */
	  constructor (prealloc = PAGE_SIZE) {
	    this.buf = [new Uint8Array(prealloc)];
	    this.offset = 0;
	  }

	  /**
	   * @returns {number} Number of buffers in the list of disjoint memory segments
	   */
	  get pages () {
	    return this.buf.length
	  }

	  /**
	   * Allocate a new memory segment to write to. Note that the whole segment must be written to
	   * as internal bookkeeping will assume all requested bytes are used.
	   *
	   * @param {number} bytes Number of bytes to allocate and reserve for immediate consumption
	   * @returns {Uint8Array}
	   */
	  alloc (bytes) {
	    const tail = this.buf.at(-1);
	    if (tail.byteLength - this.offset >= bytes) {
	      this.offset += bytes;
	      return tail.subarray(this.offset - bytes)
	    }

	    this._trim();
	    this.offset = bytes;
	    const buf = new Uint8Array(Math.max(bytes, PAGE_SIZE));
	    this.buf.push(buf);
	    return buf
	  }

	  /**
	   * Trim the tail of the internal memory segments in case the last segment was overallocated
	   * @private
	   */
	  _trim () {
	    if (this.offset === 0) {
	      this.buf.pop(); // remove the item that is unused
	    } else this.buf.push(this.buf.pop().subarray(0, this.offset));
	  }

	  /**
	   * Append filled memory segments to the internal write buffer. All segments are assumed to be
	   * completely consumed.
	   *
	   * @param  {...Uint8Array} bufs Memory segments to append to the internal write buffer
	   * @returns {Uint8Array} The last memory segment appended
	   */
	  append (...bufs) {
	    this._trim();
	    this.buf.push(...bufs);
	    const tail = this.buf.at(-1);
	    this.offset = tail.byteLength;

	    return tail
	  }

	  /**
	   * @template {number|BigInt} T
	   * @param {number} fieldNumber
	   * @param {T} value
	   * @param {{ encode(value: T, buf?: Uint8Array, byteOffset: number = 0): Uint8Array, encodingLength<T>(value: T): number}} codec
	   * @returns
	   */
	  varint (fieldNumber, value, codec = varint) {
	    if (!value) return

	    const buf = this.alloc(
	      tag$1.encodingLength(fieldNumber, wireTypes.VARINT) +
	      codec.encodingLength(value)
	    );

	    tag$1.encode(fieldNumber, wireTypes.VARINT, buf);
	    codec.encode(value, buf, tag$1.encode.bytes);
	  }

	  bytes (fieldNumber, value, codec = bytes$5) {
	    if (!value) return

	    const buf = this.alloc(
	      tag$1.encodingLength(fieldNumber, wireTypes.BYTES) +
	      codec.encodingLength(value)
	    );

	    tag$1.encode(fieldNumber, wireTypes.BYTES, buf);
	    codec.encode(value, buf, tag$1.encode.bytes);
	  }

	  fixed64 (fieldNumber, value, codec = uint64$t) {
	    if (!value) return
	    const buf = this.alloc(
	      tag$1.encodingLength(fieldNumber, wireTypes.FIXED64) +
	      codec.encodingLength(value)
	    );

	    tag$1.encode(fieldNumber, wireTypes.FIXED64, buf);
	    codec.encode(value, buf, tag$1.encode.bytes);
	  }

	  fixed32 (fieldNumber, value, codec = uint32$6) {
	    if (!value) return
	    const buf = this.alloc(
	      tag$1.encodingLength(fieldNumber, wireTypes.FIXED32) +
	      codec.encodingLength(value)
	    );

	    tag$1.encode(fieldNumber, wireTypes.FIXED32, buf);
	    codec.encode(value, buf, tag$1.encode.bytes);
	  }

	  encodingLength () {
	    let size = 0;
	    for (let i = 0; i < this.buf.length - 1; i++) {
	      size += this.buf[i].byteLength;
	    }

	    size += this.offset;

	    return size
	  }

	  /**
	   * Concatinate the internal write buffer into a single buffer
	   *
	   * @param {Uint8Array} [buf] Optional buffer to write result into. Note this must have enough
	   *                           space af `byteOffset` to contain the full encoding. If no buffer
	   *                           is passed, one will be allocated internally
	   * @param {number} byteOffset offset into `buf` that the encoding is written at
	   * @returns {Uint8Array} `buf`
	   */
	  concat (buf, byteOffset = 0) {
	    this._trim();
	    const size = this.encodingLength();

	    if (buf == null) buf = new Uint8Array(size);

	    for (let i = 0, offset = byteOffset; i < this.buf.length; i++) {
	      const b = this.buf[i];
	      buf.set(b, offset);
	      offset += b.byteLength;
	    }

	    return buf
	  }
	};

	var types$1 = wireTypes_1;

	var encode$2N = {};

	function tag (bigint) {
	  const int = Number(bigint); // Safe as protoc only allows fieldNumber up to int32 + 3 bits for wireType
	  const wireType = int & 0b111;
	  const fieldNumber = int >> 3;

	  return { wireType, fieldNumber }
	}

	function uint64$s (bigint) {
	  return BigInt.asUintN(64, bigint)
	}

	function uint32$5 (bigint) {
	  return Number(BigInt.asUintN(32, bigint))
	}

	function int64$m (bigint) {
	  return BigInt.asIntN(64, bigint)
	}

	function int32 (bigint) {
	  return Number(BigInt.asIntN(32, bigint))
	}

	function sint64 (bigint) {
	  return ((bigint >> 1n) ^ (-1n * (bigint & 1n)))
	}

	function sint32 (bigint) {
	  return Number((bigint >> 1n) ^ (-1n * (bigint & 1n)))
	}

	function bool$6 (bigint) {
	  return bigint !== 0n
	}

	function enumerable$p (uint) {
	  return Number(uint) | 0 // trick to cast uint to int
	}

	function bytes$4 (bytes) {
	  return bytes
	}

	const _dec = new TextDecoder();
	function string$1C (bytes) {
	  return _dec.decode(bytes)
	}

	function fixed64 (bytes) {
	  return _view(bytes).getBigUint64(0, true)
	}

	function sfixed64 (bytes) {
	  return _view(bytes).getBigInt64(0, true)
	}

	function double$4 (bytes) {
	  return _view(bytes).getFloat64(0, true)
	}

	function fixed32 (bytes) {
	  return _view(bytes).getUint32(0, true)
	}

	function sfixed32 (bytes) {
	  return _view(bytes).geInt32(0, true)
	}

	function float (bytes) {
	  return _view(bytes).getFloat32(0, true)
	}

	function _view (bytes) {
	  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
	}

	var types = {
	  tag,
	  uint64: uint64$s,
	  uint32: uint32$5,
	  int64: int64$m,
	  int32,
	  sint64,
	  sint32,
	  bool: bool$6,
	  enumerable: enumerable$p,
	  bytes: bytes$4,
	  string: string$1C,
	  fixed64,
	  sfixed64,
	  double: double$4,
	  fixed32,
	  sfixed32,
	  float
	};

	/// autogenerated by protoc-plugin-js
	const assert$o = nanoassert;
	const { enumerable: enumerable$o } = types$1;
	const { enumerable: decodeEnumerable$o } = types;

	const SIDE_UNSPECIFIED = 0;
	const SIDE_BUY = 1;
	const SIDE_SELL = 2;

	const enumValues$o = new Map([
	  [0, 'SIDE_UNSPECIFIED'],
	  [1, 'SIDE_BUY'],
	  [2, 'SIDE_SELL']
	]);
	const enumNames$o = new Map([
	  ['SIDE_UNSPECIFIED', 0],
	  ['SIDE_BUY', 1],
	  ['SIDE_SELL', 2]
	]);

	function encode$2M(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$2M(parse$o(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid Side value (' + value + ')')

	  return enumerable$o.encode(value, buf, byteOffset)
	}

	function decode$o(varint) {
	  const int = decodeEnumerable$o(varint);

	  return stringify$o(int) ?? int
	}

	function encodingLength$o(value) {
	  if (typeof value === 'string') return encodingLength$o(parse$o(value))
	  assert$o(value != null, 'Invalid Side value (' + value + ')');

	  if (0 <= value && value <= 2) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$o(int) {
	  return enumValues$o.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$o(str) {
	  return enumNames$o.get(str)
	}

	var Side = {
	  encode: encode$2M,
	  decode: decode$o,
	  encodingLength: encodingLength$o,
	  stringify: stringify$o,
	  parse: parse$o,
	  SIDE_UNSPECIFIED,
	  SIDE_BUY,
	  SIDE_SELL
	};

	/// autogenerated by protoc-plugin-js
	const assert$n = nanoassert;
	const { enumerable: enumerable$n } = types$1;
	const { enumerable: decodeEnumerable$n } = types;

	const TIME_IN_FORCE_UNSPECIFIED = 0;
	const TIME_IN_FORCE_GTC = 1;
	const TIME_IN_FORCE_GTT = 2;
	const TIME_IN_FORCE_IOC = 3;
	const TIME_IN_FORCE_FOK = 4;
	const TIME_IN_FORCE_GFA = 5;
	const TIME_IN_FORCE_GFN = 6;

	const enumValues$n = new Map([
	  [0, 'TIME_IN_FORCE_UNSPECIFIED'],
	  [1, 'TIME_IN_FORCE_GTC'],
	  [2, 'TIME_IN_FORCE_GTT'],
	  [3, 'TIME_IN_FORCE_IOC'],
	  [4, 'TIME_IN_FORCE_FOK'],
	  [5, 'TIME_IN_FORCE_GFA'],
	  [6, 'TIME_IN_FORCE_GFN']
	]);
	const enumNames$n = new Map([
	  ['TIME_IN_FORCE_UNSPECIFIED', 0],
	  ['TIME_IN_FORCE_GTC', 1],
	  ['TIME_IN_FORCE_GTT', 2],
	  ['TIME_IN_FORCE_IOC', 3],
	  ['TIME_IN_FORCE_FOK', 4],
	  ['TIME_IN_FORCE_GFA', 5],
	  ['TIME_IN_FORCE_GFN', 6]
	]);

	function encode$2L(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$2L(parse$n(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid TimeInForce value (' + value + ')')

	  return enumerable$n.encode(value, buf, byteOffset)
	}

	function decode$n(varint) {
	  const int = decodeEnumerable$n(varint);

	  return stringify$n(int) ?? int
	}

	function encodingLength$n(value) {
	  if (typeof value === 'string') return encodingLength$n(parse$n(value))
	  assert$n(value != null, 'Invalid TimeInForce value (' + value + ')');

	  if (0 <= value && value <= 6) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$n(int) {
	  return enumValues$n.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$n(str) {
	  return enumNames$n.get(str)
	}

	var TimeInForce = {
	  encode: encode$2L,
	  decode: decode$n,
	  encodingLength: encodingLength$n,
	  stringify: stringify$n,
	  parse: parse$n,
	  TIME_IN_FORCE_UNSPECIFIED,
	  TIME_IN_FORCE_GTC,
	  TIME_IN_FORCE_GTT,
	  TIME_IN_FORCE_IOC,
	  TIME_IN_FORCE_FOK,
	  TIME_IN_FORCE_GFA,
	  TIME_IN_FORCE_GFN
	};

	/// autogenerated by protoc-plugin-js
	const assert$m = nanoassert;
	const { enumerable: enumerable$m } = types$1;
	const { enumerable: decodeEnumerable$m } = types;

	const TYPE_UNSPECIFIED$2 = 0;
	const TYPE_LIMIT = 1;
	const TYPE_MARKET = 2;
	const TYPE_NETWORK = 3;

	const enumValues$m = new Map([
	  [0, 'TYPE_UNSPECIFIED'],
	  [1, 'TYPE_LIMIT'],
	  [2, 'TYPE_MARKET'],
	  [3, 'TYPE_NETWORK']
	]);
	const enumNames$m = new Map([
	  ['TYPE_UNSPECIFIED', 0],
	  ['TYPE_LIMIT', 1],
	  ['TYPE_MARKET', 2],
	  ['TYPE_NETWORK', 3]
	]);

	function encode$2K(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$2K(parse$m(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid Type value (' + value + ')')

	  return enumerable$m.encode(value, buf, byteOffset)
	}

	function decode$m(varint) {
	  const int = decodeEnumerable$m(varint);

	  return stringify$m(int) ?? int
	}

	function encodingLength$m(value) {
	  if (typeof value === 'string') return encodingLength$m(parse$m(value))
	  assert$m(value != null, 'Invalid Type value (' + value + ')');

	  if (0 <= value && value <= 3) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$m(int) {
	  return enumValues$m.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$m(str) {
	  return enumNames$m.get(str)
	}

	var Type$2 = {
	  encode: encode$2K,
	  decode: decode$m,
	  encodingLength: encodingLength$m,
	  stringify: stringify$m,
	  parse: parse$m,
	  TYPE_UNSPECIFIED: TYPE_UNSPECIFIED$2,
	  TYPE_LIMIT,
	  TYPE_MARKET,
	  TYPE_NETWORK
	};

	var encode$2J = {};

	/// autogenerated by protoc-plugin-js
	const assert$l = nanoassert;
	const { enumerable: enumerable$l } = types$1;
	const { enumerable: decodeEnumerable$l } = types;

	const PEGGED_REFERENCE_UNSPECIFIED = 0;
	const PEGGED_REFERENCE_MID = 1;
	const PEGGED_REFERENCE_BEST_BID = 2;
	const PEGGED_REFERENCE_BEST_ASK = 3;

	const enumValues$l = new Map([
	  [0, 'PEGGED_REFERENCE_UNSPECIFIED'],
	  [1, 'PEGGED_REFERENCE_MID'],
	  [2, 'PEGGED_REFERENCE_BEST_BID'],
	  [3, 'PEGGED_REFERENCE_BEST_ASK']
	]);
	const enumNames$l = new Map([
	  ['PEGGED_REFERENCE_UNSPECIFIED', 0],
	  ['PEGGED_REFERENCE_MID', 1],
	  ['PEGGED_REFERENCE_BEST_BID', 2],
	  ['PEGGED_REFERENCE_BEST_ASK', 3]
	]);

	function encode$2I(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$2I(parse$l(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid PeggedReference value (' + value + ')')

	  return enumerable$l.encode(value, buf, byteOffset)
	}

	function decode$l(varint) {
	  const int = decodeEnumerable$l(varint);

	  return stringify$l(int) ?? int
	}

	function encodingLength$l(value) {
	  if (typeof value === 'string') return encodingLength$l(parse$l(value))
	  assert$l(value != null, 'Invalid PeggedReference value (' + value + ')');

	  if (0 <= value && value <= 3) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$l(int) {
	  return enumValues$l.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$l(str) {
	  return enumNames$l.get(str)
	}

	var PeggedReference = {
	  encode: encode$2I,
	  decode: decode$l,
	  encodingLength: encodingLength$l,
	  stringify: stringify$l,
	  parse: parse$l,
	  PEGGED_REFERENCE_UNSPECIFIED,
	  PEGGED_REFERENCE_MID,
	  PEGGED_REFERENCE_BEST_BID,
	  PEGGED_REFERENCE_BEST_ASK
	};

	/// autogenerated by protoc-plugin-js
	const Writer$2m = writer;
	const { string: string$1B } = types$1;
	const _vega_PeggedReference$1 = PeggedReference;

	encode$2J.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2m();

	  if (obj.reference) writer.varint(1, obj.reference, _vega_PeggedReference$1);
	  if (obj.offset) writer.bytes(2, obj.offset, string$1B);

	  return writer.concat(buf, byteOffset)
	};

	var encode$2H = {};

	/// autogenerated by protoc-plugin-js
	const Writer$2l = writer;
	const { uint64: uint64$r } = types$1;

	encode$2H.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2l();

	  if (obj.peakSize) writer.varint(1, obj.peakSize, uint64$r);
	  if (obj.minimumVisibleSize) writer.varint(2, obj.minimumVisibleSize, uint64$r);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$2k = writer;
	const { string: string$1A, uint64: uint64$q, int64: int64$l, bool: bool$5 } = types$1;
	const _vega_Side = Side;
	const _vega_Order_TimeInForce$1 = TimeInForce;
	const _vega_Order_Type = Type$2;
	const _vega_PeggedOrder = encode$2J;
	const _vega_commands_v1_IcebergOpts = encode$2H;

	encode$2N.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2k();

	  if (obj.marketId) writer.bytes(1, obj.marketId, string$1A);
	  if (obj.price) writer.bytes(2, obj.price, string$1A);
	  if (obj.size) writer.varint(3, obj.size, uint64$q);
	  if (obj.side) writer.varint(4, obj.side, _vega_Side);
	  if (obj.timeInForce)
	    writer.varint(5, obj.timeInForce, _vega_Order_TimeInForce$1);
	  if (obj.expiresAt) writer.varint(6, obj.expiresAt, int64$l);
	  if (obj.type) writer.varint(7, obj.type, _vega_Order_Type);
	  if (obj.reference) writer.bytes(8, obj.reference, string$1A);
	  if (obj.peggedOrder)
	    writer.bytes(9, _vega_PeggedOrder.encode(obj.peggedOrder));
	  if (obj.postOnly) writer.varint(10, obj.postOnly, bool$5);
	  if (obj.reduceOnly) writer.varint(11, obj.reduceOnly, bool$5);
	  if (obj.icebergOpts)
	    writer.bytes(12, _vega_commands_v1_IcebergOpts.encode(obj.icebergOpts));

	  return writer.concat(buf, byteOffset)
	};

	var encode$2G = {};

	/// autogenerated by protoc-plugin-js
	const Writer$2j = writer;
	const { string: string$1z } = types$1;

	encode$2G.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2j();

	  if (obj.orderId) writer.bytes(1, obj.orderId, string$1z);
	  if (obj.marketId) writer.bytes(2, obj.marketId, string$1z);

	  return writer.concat(buf, byteOffset)
	};

	var encode$2F = {};

	/// autogenerated by protoc-plugin-js
	const Writer$2i = writer;
	const { string: string$1y, int64: int64$k, uint64: uint64$p } = types$1;
	const _vega_Order_TimeInForce = TimeInForce;
	const _vega_PeggedReference = PeggedReference;

	encode$2F.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2i();

	  if (obj.orderId) writer.bytes(1, obj.orderId, string$1y);
	  if (obj.marketId) writer.bytes(2, obj.marketId, string$1y);
	  if (obj.price) writer.bytes(3, obj.price, string$1y);
	  if (obj.sizeDelta) writer.varint(4, obj.sizeDelta, int64$k);
	  if (obj.expiresAt) writer.varint(5, obj.expiresAt, int64$k);
	  if (obj.timeInForce)
	    writer.varint(6, obj.timeInForce, _vega_Order_TimeInForce);
	  if (obj.peggedOffset) writer.bytes(7, obj.peggedOffset, string$1y);
	  if (obj.peggedReference)
	    writer.varint(8, obj.peggedReference, _vega_PeggedReference);
	  if (obj.size) writer.varint(9, obj.size, uint64$p);

	  return writer.concat(buf, byteOffset)
	};

	var encode$2E = {};

	var encode$2D = {};

	var encode$2C = {};

	/// autogenerated by protoc-plugin-js
	const Writer$2h = writer;
	const { string: string$1x } = types$1;

	encode$2C.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2h();

	  if (obj.receiverAddress) writer.bytes(1, obj.receiverAddress, string$1x);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$2g = writer;

	const _vega_Erc20WithdrawExt = encode$2C;

	encode$2D.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2g();

	  if (obj.ext?.erc20 ?? obj.erc20)
	    writer.bytes(1, _vega_Erc20WithdrawExt.encode(obj.ext?.erc20 ?? obj.erc20));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$2f = writer;
	const { string: string$1w } = types$1;
	const _vega_WithdrawExt = encode$2D;

	encode$2E.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2f();

	  if (obj.amount) writer.bytes(1, obj.amount, string$1w);
	  if (obj.asset) writer.bytes(2, obj.asset, string$1w);
	  if (obj.ext) writer.bytes(3, _vega_WithdrawExt.encode(obj.ext));

	  return writer.concat(buf, byteOffset)
	};

	var encode$2B = {};

	var encode$2A = {};

	var encode$2z = {};

	var encode$2y = {};

	var encode$2x = {};

	var encode$2w = {};

	var encode$2v = {};

	var encode$2u = {};

	var encode$2t = {};

	var encode$2s = {};

	/// autogenerated by protoc-plugin-js
	const assert$k = nanoassert;
	const { enumerable: enumerable$k } = types$1;
	const { enumerable: decodeEnumerable$k } = types;

	const OPERATOR_UNSPECIFIED = 0;
	const OPERATOR_EQUALS = 1;
	const OPERATOR_GREATER_THAN = 2;
	const OPERATOR_GREATER_THAN_OR_EQUAL = 3;
	const OPERATOR_LESS_THAN = 4;
	const OPERATOR_LESS_THAN_OR_EQUAL = 5;

	const enumValues$k = new Map([
	  [0, 'OPERATOR_UNSPECIFIED'],
	  [1, 'OPERATOR_EQUALS'],
	  [2, 'OPERATOR_GREATER_THAN'],
	  [3, 'OPERATOR_GREATER_THAN_OR_EQUAL'],
	  [4, 'OPERATOR_LESS_THAN'],
	  [5, 'OPERATOR_LESS_THAN_OR_EQUAL']
	]);
	const enumNames$k = new Map([
	  ['OPERATOR_UNSPECIFIED', 0],
	  ['OPERATOR_EQUALS', 1],
	  ['OPERATOR_GREATER_THAN', 2],
	  ['OPERATOR_GREATER_THAN_OR_EQUAL', 3],
	  ['OPERATOR_LESS_THAN', 4],
	  ['OPERATOR_LESS_THAN_OR_EQUAL', 5]
	]);

	function encode$2r(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$2r(parse$k(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid Operator value (' + value + ')')

	  return enumerable$k.encode(value, buf, byteOffset)
	}

	function decode$k(varint) {
	  const int = decodeEnumerable$k(varint);

	  return stringify$k(int) ?? int
	}

	function encodingLength$k(value) {
	  if (typeof value === 'string') return encodingLength$k(parse$k(value))
	  assert$k(value != null, 'Invalid Operator value (' + value + ')');

	  if (0 <= value && value <= 5) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$k(int) {
	  return enumValues$k.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$k(str) {
	  return enumNames$k.get(str)
	}

	var Operator = {
	  encode: encode$2r,
	  decode: decode$k,
	  encodingLength: encodingLength$k,
	  stringify: stringify$k,
	  parse: parse$k,
	  OPERATOR_UNSPECIFIED,
	  OPERATOR_EQUALS,
	  OPERATOR_GREATER_THAN,
	  OPERATOR_GREATER_THAN_OR_EQUAL,
	  OPERATOR_LESS_THAN,
	  OPERATOR_LESS_THAN_OR_EQUAL
	};

	/// autogenerated by protoc-plugin-js
	const Writer$2e = writer;
	const { string: string$1v } = types$1;
	const _vega_data_v1_Condition_Operator = Operator;

	encode$2s.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2e();

	  if (obj.operator)
	    writer.varint(1, obj.operator, _vega_data_v1_Condition_Operator);
	  if (obj.value) writer.bytes(2, obj.value, string$1v);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$2d = writer;

	const _vega_data_v1_Condition$2 = encode$2s;

	encode$2t.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2d();

	  if (obj.conditions?.length)
	    obj.conditions.forEach((v) =>
	      writer.bytes(1, _vega_data_v1_Condition$2.encode(v))
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$2q = {};

	var encode$2p = {};

	/// autogenerated by protoc-plugin-js
	const Writer$2c = writer;
	const { int64: int64$j } = types$1;

	encode$2p.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2c();

	  if (obj.initial) writer.varint(1, obj.initial, int64$j);
	  if (obj.every) writer.varint(2, obj.every, int64$j);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$2b = writer;

	const _vega_data_v1_Condition$1 = encode$2s;
	const _vega_data_v1_InternalTimeTrigger = encode$2p;

	encode$2q.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2b();

	  if (obj.conditions?.length)
	    obj.conditions.forEach((v) =>
	      writer.bytes(1, _vega_data_v1_Condition$1.encode(v))
	    );
	  if (obj.triggers?.length)
	    obj.triggers.forEach((v) =>
	      writer.bytes(2, _vega_data_v1_InternalTimeTrigger.encode(v))
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$2a = writer;

	const _vega_DataSourceSpecConfigurationTime = encode$2t;
	const _vega_DataSourceSpecConfigurationTimeTrigger = encode$2q;

	encode$2u.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2a();

	  if (obj.sourceType?.time ?? obj.time)
	    writer.bytes(
	      1,
	      _vega_DataSourceSpecConfigurationTime.encode(
	        obj.sourceType?.time ?? obj.time
	      )
	    );
	  if (obj.sourceType?.timeTrigger ?? obj.timeTrigger)
	    writer.bytes(
	      2,
	      _vega_DataSourceSpecConfigurationTimeTrigger.encode(
	        obj.sourceType?.timeTrigger ?? obj.timeTrigger
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$2o = {};

	var encode$2n = {};

	var encode$2m = {};

	var encode$2l = {};

	/// autogenerated by protoc-plugin-js
	const Writer$29 = writer;
	const { string: string$1u } = types$1;

	encode$2l.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$29();

	  if (obj.key) writer.bytes(1, obj.key, string$1u);

	  return writer.concat(buf, byteOffset)
	};

	var encode$2k = {};

	/// autogenerated by protoc-plugin-js
	const Writer$28 = writer;
	const { string: string$1t } = types$1;

	encode$2k.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$28();

	  if (obj.address) writer.bytes(1, obj.address, string$1t);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$27 = writer;

	const _vega_data_v1_PubKey = encode$2l;
	const _vega_data_v1_ETHAddress = encode$2k;

	encode$2m.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$27();

	  if (obj.signer?.pubKey ?? obj.pubKey)
	    writer.bytes(
	      1,
	      _vega_data_v1_PubKey.encode(obj.signer?.pubKey ?? obj.pubKey)
	    );
	  if (obj.signer?.ethAddress ?? obj.ethAddress)
	    writer.bytes(
	      2,
	      _vega_data_v1_ETHAddress.encode(obj.signer?.ethAddress ?? obj.ethAddress)
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$2j = {};

	var encode$2i = {};

	/// autogenerated by protoc-plugin-js
	const assert$j = nanoassert;
	const { enumerable: enumerable$j } = types$1;
	const { enumerable: decodeEnumerable$j } = types;

	const TYPE_UNSPECIFIED$1 = 0;
	const TYPE_EMPTY = 1;
	const TYPE_INTEGER = 2;
	const TYPE_STRING = 3;
	const TYPE_BOOLEAN = 4;
	const TYPE_DECIMAL = 5;
	const TYPE_TIMESTAMP = 6;

	const enumValues$j = new Map([
	  [0, 'TYPE_UNSPECIFIED'],
	  [1, 'TYPE_EMPTY'],
	  [2, 'TYPE_INTEGER'],
	  [3, 'TYPE_STRING'],
	  [4, 'TYPE_BOOLEAN'],
	  [5, 'TYPE_DECIMAL'],
	  [6, 'TYPE_TIMESTAMP']
	]);
	const enumNames$j = new Map([
	  ['TYPE_UNSPECIFIED', 0],
	  ['TYPE_EMPTY', 1],
	  ['TYPE_INTEGER', 2],
	  ['TYPE_STRING', 3],
	  ['TYPE_BOOLEAN', 4],
	  ['TYPE_DECIMAL', 5],
	  ['TYPE_TIMESTAMP', 6]
	]);

	function encode$2h(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$2h(parse$j(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid Type value (' + value + ')')

	  return enumerable$j.encode(value, buf, byteOffset)
	}

	function decode$j(varint) {
	  const int = decodeEnumerable$j(varint);

	  return stringify$j(int) ?? int
	}

	function encodingLength$j(value) {
	  if (typeof value === 'string') return encodingLength$j(parse$j(value))
	  assert$j(value != null, 'Invalid Type value (' + value + ')');

	  if (0 <= value && value <= 6) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$j(int) {
	  return enumValues$j.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$j(str) {
	  return enumNames$j.get(str)
	}

	var Type$1 = {
	  encode: encode$2h,
	  decode: decode$j,
	  encodingLength: encodingLength$j,
	  stringify: stringify$j,
	  parse: parse$j,
	  TYPE_UNSPECIFIED: TYPE_UNSPECIFIED$1,
	  TYPE_EMPTY,
	  TYPE_INTEGER,
	  TYPE_STRING,
	  TYPE_BOOLEAN,
	  TYPE_DECIMAL,
	  TYPE_TIMESTAMP
	};

	/// autogenerated by protoc-plugin-js
	const Writer$26 = writer;
	const { string: string$1s, uint64: uint64$o } = types$1;
	const _vega_data_v1_PropertyKey_Type = Type$1;

	encode$2i.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$26();

	  if (obj.name) writer.bytes(1, obj.name, string$1s);
	  if (obj.type) writer.varint(2, obj.type, _vega_data_v1_PropertyKey_Type);
	  if (obj.numberDecimalPlaces) writer.varint(3, obj.numberDecimalPlaces, uint64$o);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$25 = writer;

	const _vega_data_v1_PropertyKey = encode$2i;
	const _vega_data_v1_Condition = encode$2s;

	encode$2j.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$25();

	  if (obj.key) writer.bytes(1, _vega_data_v1_PropertyKey.encode(obj.key));
	  if (obj.conditions?.length)
	    obj.conditions.forEach((v) =>
	      writer.bytes(2, _vega_data_v1_Condition.encode(v))
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$24 = writer;

	const _vega_data_v1_Signer = encode$2m;
	const _vega_data_v1_Filter$1 = encode$2j;

	encode$2n.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$24();

	  if (obj.signers?.length)
	    obj.signers.forEach((v) => writer.bytes(1, _vega_data_v1_Signer.encode(v)));
	  if (obj.filters?.length)
	    obj.filters.forEach((v) => writer.bytes(2, _vega_data_v1_Filter$1.encode(v)));

	  return writer.concat(buf, byteOffset)
	};

	var encode$2g = {};

	var encode$2f = {};

	/// autogenerated by protoc-plugin-js
	const assert$i = nanoassert;
	const { enumerable: enumerable$i } = types$1;
	const { enumerable: decodeEnumerable$i } = types;

	const NULL_VALUE = 0;

	const enumValues$i = new Map([[0, 'NULL_VALUE']]);
	const enumNames$i = new Map([['NULL_VALUE', 0]]);

	function encode$2e(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$2e(parse$i(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid NullValue value (' + value + ')')

	  return enumerable$i.encode(value, buf, byteOffset)
	}

	function decode$i(varint) {
	  const int = decodeEnumerable$i(varint);

	  return stringify$i(int) ?? int
	}

	function encodingLength$i(value) {
	  if (typeof value === 'string') return encodingLength$i(parse$i(value))
	  assert$i(value != null, 'Invalid NullValue value (' + value + ')');

	  if (0 <= value && value <= 0) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$i(int) {
	  return enumValues$i.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$i(str) {
	  return enumNames$i.get(str)
	}

	var NullValue = {
	  encode: encode$2e,
	  decode: decode$i,
	  encodingLength: encodingLength$i,
	  stringify: stringify$i,
	  parse: parse$i,
	  NULL_VALUE
	};

	var encode$2d = {};

	var encode$2c = {};

	var hasRequiredEncode$3;

	function requireEncode$3 () {
		if (hasRequiredEncode$3) return encode$2c;
		hasRequiredEncode$3 = 1;
		/// autogenerated by protoc-plugin-js
		const Writer = writer;
		const { string } = types$1;
		const _google_protobuf_Value = requireEncode();

		encode$2c.encode = function encode(obj = {}, buf, byteOffset = 0) {
		  const writer = new Writer();

		  if (obj.key) writer.bytes(1, obj.key, string);
		  if (obj.value) writer.bytes(2, _google_protobuf_Value.encode(obj.value));

		  return writer.concat(buf, byteOffset)
		};

		// export function encodingLength (obj) {
		//   throw new Error('Unimplemented')
		// }
		return encode$2c;
	}

	var hasRequiredEncode$2;

	function requireEncode$2 () {
		if (hasRequiredEncode$2) return encode$2d;
		hasRequiredEncode$2 = 1;
		/// autogenerated by protoc-plugin-js
		const Writer = writer;

		const _google_protobuf_Struct_FieldsEntry = requireEncode$3();

		encode$2d.encode = function encode(obj = {}, buf, byteOffset = 0) {
		  const writer = new Writer();

		  if (obj.fields?.length)
		    obj.fields.forEach((v) =>
		      writer.bytes(1, _google_protobuf_Struct_FieldsEntry.encode(v))
		    );

		  return writer.concat(buf, byteOffset)
		};

		// export function encodingLength (obj) {
		//   throw new Error('Unimplemented')
		// }
		return encode$2d;
	}

	var encode$2b = {};

	var hasRequiredEncode$1;

	function requireEncode$1 () {
		if (hasRequiredEncode$1) return encode$2b;
		hasRequiredEncode$1 = 1;
		/// autogenerated by protoc-plugin-js
		const Writer = writer;

		const _google_protobuf_Value = requireEncode();

		encode$2b.encode = function encode(obj = {}, buf, byteOffset = 0) {
		  const writer = new Writer();

		  if (obj.values?.length)
		    obj.values.forEach((v) => writer.bytes(1, _google_protobuf_Value.encode(v)));

		  return writer.concat(buf, byteOffset)
		};

		// export function encodingLength (obj) {
		//   throw new Error('Unimplemented')
		// }
		return encode$2b;
	}

	var hasRequiredEncode;

	function requireEncode () {
		if (hasRequiredEncode) return encode$2f;
		hasRequiredEncode = 1;
		/// autogenerated by protoc-plugin-js
		const Writer = writer;
		const { double, string, bool } = types$1;
		const _google_protobuf_NullValue = NullValue;
		const _google_protobuf_Struct = requireEncode$2();
		const _google_protobuf_ListValue = requireEncode$1();

		encode$2f.encode = function encode(obj = {}, buf, byteOffset = 0) {
		  const writer = new Writer();

		  if (obj.kind?.nullValue ?? obj.nullValue)
		    writer.varint(
		      1,
		      obj.kind?.nullValue ?? obj.nullValue,
		      _google_protobuf_NullValue
		    );
		  if (obj.kind?.numberValue ?? obj.numberValue)
		    writer.fixed64(2, obj.kind?.numberValue ?? obj.numberValue, double);
		  if (obj.kind?.stringValue ?? obj.stringValue)
		    writer.bytes(3, obj.kind?.stringValue ?? obj.stringValue, string);
		  if (obj.kind?.boolValue ?? obj.boolValue)
		    writer.varint(4, obj.kind?.boolValue ?? obj.boolValue, bool);
		  if (obj.kind?.structValue ?? obj.structValue)
		    writer.bytes(
		      5,
		      _google_protobuf_Struct.encode(obj.kind?.structValue ?? obj.structValue)
		    );
		  if (obj.kind?.listValue ?? obj.listValue)
		    writer.bytes(
		      6,
		      _google_protobuf_ListValue.encode(obj.kind?.listValue ?? obj.listValue)
		    );

		  return writer.concat(buf, byteOffset)
		};

		// export function encodingLength (obj) {
		//   throw new Error('Unimplemented')
		// }
		return encode$2f;
	}

	var encode$2a = {};

	var encode$29 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$23 = writer;
	const { uint64: uint64$n } = types$1;

	encode$29.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$23();

	  if (obj.initial) writer.varint(1, obj.initial, uint64$n);
	  if (obj.every) writer.varint(2, obj.every, uint64$n);
	  if (obj.until) writer.varint(3, obj.until, uint64$n);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$22 = writer;

	const _vega_EthTimeTrigger = encode$29;

	encode$2a.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$22();

	  if (obj.trigger?.timeTrigger ?? obj.timeTrigger)
	    writer.bytes(
	      1,
	      _vega_EthTimeTrigger.encode(obj.trigger?.timeTrigger ?? obj.timeTrigger)
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$28 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$21 = writer;
	const { string: string$1r } = types$1;

	encode$28.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$21();

	  if (obj.name) writer.bytes(1, obj.name, string$1r);
	  if (obj.expression) writer.bytes(2, obj.expression, string$1r);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$20 = writer;
	const { string: string$1q, uint64: uint64$m } = types$1;
	const _google_protobuf_Value = requireEncode();
	const _vega_EthCallTrigger = encode$2a;
	const _vega_data_v1_Filter = encode$2j;
	const _vega_Normaliser = encode$28;

	encode$2g.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$20();

	  if (obj.address) writer.bytes(1, obj.address, string$1q);
	  if (obj.abi) writer.bytes(2, obj.abi, string$1q);
	  if (obj.method) writer.bytes(3, obj.method, string$1q);
	  if (obj.args?.length)
	    obj.args.forEach((v) => writer.bytes(4, _google_protobuf_Value.encode(v)));
	  if (obj.trigger) writer.bytes(5, _vega_EthCallTrigger.encode(obj.trigger));
	  if (obj.requiredConfirmations)
	    writer.varint(6, obj.requiredConfirmations, uint64$m);
	  if (obj.filters?.length)
	    obj.filters.forEach((v) => writer.bytes(7, _vega_data_v1_Filter.encode(v)));
	  if (obj.normalisers?.length)
	    obj.normalisers.forEach((v) => writer.bytes(8, _vega_Normaliser.encode(v)));
	  if (obj.sourceChainId) writer.varint(9, obj.sourceChainId, uint64$m);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1$ = writer;

	const _vega_DataSourceSpecConfiguration = encode$2n;
	const _vega_EthCallSpec = encode$2g;

	encode$2o.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1$();

	  if (obj.sourceType?.oracle ?? obj.oracle)
	    writer.bytes(
	      1,
	      _vega_DataSourceSpecConfiguration.encode(
	        obj.sourceType?.oracle ?? obj.oracle
	      )
	    );
	  if (obj.sourceType?.ethOracle ?? obj.ethOracle)
	    writer.bytes(
	      2,
	      _vega_EthCallSpec.encode(obj.sourceType?.ethOracle ?? obj.ethOracle)
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1_ = writer;

	const _vega_DataSourceDefinitionInternal = encode$2u;
	const _vega_DataSourceDefinitionExternal = encode$2o;

	encode$2v.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1_();

	  if (obj.sourceType?.internal ?? obj.internal)
	    writer.bytes(
	      1,
	      _vega_DataSourceDefinitionInternal.encode(
	        obj.sourceType?.internal ?? obj.internal
	      )
	    );
	  if (obj.sourceType?.external ?? obj.external)
	    writer.bytes(
	      2,
	      _vega_DataSourceDefinitionExternal.encode(
	        obj.sourceType?.external ?? obj.external
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$27 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1Z = writer;
	const { string: string$1p } = types$1;

	encode$27.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1Z();

	  if (obj.settlementDataProperty)
	    writer.bytes(1, obj.settlementDataProperty, string$1p);
	  if (obj.tradingTerminationProperty)
	    writer.bytes(2, obj.tradingTerminationProperty, string$1p);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1Y = writer;
	const { string: string$1o } = types$1;
	const _vega_DataSourceDefinition$4 = encode$2v;
	const _vega_DataSourceSpecToFutureBinding$1 = encode$27;

	encode$2w.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1Y();

	  if (obj.quoteName) writer.bytes(1, obj.quoteName, string$1o);
	  if (obj.dataSourceSpecForSettlementData)
	    writer.bytes(
	      2,
	      _vega_DataSourceDefinition$4.encode(obj.dataSourceSpecForSettlementData)
	    );
	  if (obj.dataSourceSpecForTradingTermination)
	    writer.bytes(
	      3,
	      _vega_DataSourceDefinition$4.encode(obj.dataSourceSpecForTradingTermination)
	    );
	  if (obj.dataSourceSpecBinding)
	    writer.bytes(
	      4,
	      _vega_DataSourceSpecToFutureBinding$1.encode(obj.dataSourceSpecBinding)
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$26 = {};

	var encode$25 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1X = writer;
	const { string: string$1n } = types$1;

	encode$25.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1X();

	  if (obj.settlementDataProperty)
	    writer.bytes(1, obj.settlementDataProperty, string$1n);
	  if (obj.settlementScheduleProperty)
	    writer.bytes(2, obj.settlementScheduleProperty, string$1n);

	  return writer.concat(buf, byteOffset)
	};

	var encode$24 = {};

	/// autogenerated by protoc-plugin-js
	const assert$h = nanoassert;
	const { enumerable: enumerable$h } = types$1;
	const { enumerable: decodeEnumerable$h } = types;

	const COMPOSITE_PRICE_TYPE_UNSPECIFIED = 0;
	const COMPOSITE_PRICE_TYPE_WEIGHTED = 1;
	const COMPOSITE_PRICE_TYPE_MEDIAN = 2;
	const COMPOSITE_PRICE_TYPE_LAST_TRADE = 3;

	const enumValues$h = new Map([
	  [0, 'COMPOSITE_PRICE_TYPE_UNSPECIFIED'],
	  [1, 'COMPOSITE_PRICE_TYPE_WEIGHTED'],
	  [2, 'COMPOSITE_PRICE_TYPE_MEDIAN'],
	  [3, 'COMPOSITE_PRICE_TYPE_LAST_TRADE']
	]);
	const enumNames$h = new Map([
	  ['COMPOSITE_PRICE_TYPE_UNSPECIFIED', 0],
	  ['COMPOSITE_PRICE_TYPE_WEIGHTED', 1],
	  ['COMPOSITE_PRICE_TYPE_MEDIAN', 2],
	  ['COMPOSITE_PRICE_TYPE_LAST_TRADE', 3]
	]);

	function encode$23(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$23(parse$h(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid CompositePriceType value (' + value + ')')

	  return enumerable$h.encode(value, buf, byteOffset)
	}

	function decode$h(varint) {
	  const int = decodeEnumerable$h(varint);

	  return stringify$h(int) ?? int
	}

	function encodingLength$h(value) {
	  if (typeof value === 'string') return encodingLength$h(parse$h(value))
	  assert$h(value != null, 'Invalid CompositePriceType value (' + value + ')');

	  if (0 <= value && value <= 3) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$h(int) {
	  return enumValues$h.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$h(str) {
	  return enumNames$h.get(str)
	}

	var CompositePriceType = {
	  encode: encode$23,
	  decode: decode$h,
	  encodingLength: encodingLength$h,
	  stringify: stringify$h,
	  parse: parse$h,
	  COMPOSITE_PRICE_TYPE_UNSPECIFIED,
	  COMPOSITE_PRICE_TYPE_WEIGHTED,
	  COMPOSITE_PRICE_TYPE_MEDIAN,
	  COMPOSITE_PRICE_TYPE_LAST_TRADE
	};

	var encode$22 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1W = writer;
	const { string: string$1m } = types$1;

	encode$22.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1W();

	  if (obj.priceSourceProperty) writer.bytes(1, obj.priceSourceProperty, string$1m);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1V = writer;
	const { string: string$1l, uint64: uint64$l } = types$1;
	const _vega_CompositePriceType = CompositePriceType;
	const _vega_DataSourceDefinition$3 = encode$2v;
	const _vega_SpecBindingForCompositePrice = encode$22;

	encode$24.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1V();

	  if (obj.decayWeight) writer.bytes(1, obj.decayWeight, string$1l);
	  if (obj.decayPower) writer.varint(2, obj.decayPower, uint64$l);
	  if (obj.cashAmount) writer.bytes(3, obj.cashAmount, string$1l);
	  if (obj.sourceWeights?.length)
	    obj.sourceWeights.forEach((v) => writer.bytes(4, v, string$1l));
	  if (obj.sourceStalenessTolerance?.length)
	    obj.sourceStalenessTolerance.forEach((v) => writer.bytes(5, v, string$1l));
	  if (obj.compositePriceType)
	    writer.varint(6, obj.compositePriceType, _vega_CompositePriceType);
	  if (obj.dataSourcesSpec?.length)
	    obj.dataSourcesSpec.forEach((v) =>
	      writer.bytes(7, _vega_DataSourceDefinition$3.encode(v))
	    );
	  if (obj.dataSourcesSpecBinding?.length)
	    obj.dataSourcesSpecBinding.forEach((v) =>
	      writer.bytes(8, _vega_SpecBindingForCompositePrice.encode(v))
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1U = writer;
	const { string: string$1k } = types$1;
	const _vega_DataSourceDefinition$2 = encode$2v;
	const _vega_DataSourceSpecToPerpetualBinding$1 = encode$25;
	const _vega_CompositePriceConfiguration$3 = encode$24;

	encode$26.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1U();

	  if (obj.quoteName) writer.bytes(1, obj.quoteName, string$1k);
	  if (obj.marginFundingFactor) writer.bytes(2, obj.marginFundingFactor, string$1k);
	  if (obj.interestRate) writer.bytes(3, obj.interestRate, string$1k);
	  if (obj.clampLowerBound) writer.bytes(4, obj.clampLowerBound, string$1k);
	  if (obj.clampUpperBound) writer.bytes(5, obj.clampUpperBound, string$1k);
	  if (obj.dataSourceSpecForSettlementSchedule)
	    writer.bytes(
	      6,
	      _vega_DataSourceDefinition$2.encode(obj.dataSourceSpecForSettlementSchedule)
	    );
	  if (obj.dataSourceSpecForSettlementData)
	    writer.bytes(
	      7,
	      _vega_DataSourceDefinition$2.encode(obj.dataSourceSpecForSettlementData)
	    );
	  if (obj.dataSourceSpecBinding)
	    writer.bytes(
	      8,
	      _vega_DataSourceSpecToPerpetualBinding$1.encode(obj.dataSourceSpecBinding)
	    );
	  if (obj.fundingRateScalingFactor)
	    writer.bytes(9, obj.fundingRateScalingFactor, string$1k);
	  if (obj.fundingRateLowerBound)
	    writer.bytes(10, obj.fundingRateLowerBound, string$1k);
	  if (obj.fundingRateUpperBound)
	    writer.bytes(11, obj.fundingRateUpperBound, string$1k);
	  if (obj.internalCompositePriceConfiguration)
	    writer.bytes(
	      13,
	      _vega_CompositePriceConfiguration$3.encode(
	        obj.internalCompositePriceConfiguration
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1T = writer;
	const { string: string$1j } = types$1;
	const _vega_UpdateFutureProduct = encode$2w;
	const _vega_UpdatePerpetualProduct = encode$26;

	encode$2x.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1T();

	  if (obj.code) writer.bytes(1, obj.code, string$1j);
	  if (obj.name) writer.bytes(2, obj.name, string$1j);

	  if (obj.product?.future ?? obj.future)
	    writer.bytes(
	      100,
	      _vega_UpdateFutureProduct.encode(obj.product?.future ?? obj.future)
	    );
	  if (obj.product?.perpetual ?? obj.perpetual)
	    writer.bytes(
	      101,
	      _vega_UpdatePerpetualProduct.encode(
	        obj.product?.perpetual ?? obj.perpetual
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$21 = {};

	var encode$20 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1S = writer;
	const { int64: int64$i, string: string$1i } = types$1;

	encode$20.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1S();

	  if (obj.horizon) writer.varint(1, obj.horizon, int64$i);
	  if (obj.probability) writer.bytes(2, obj.probability, string$1i);
	  if (obj.auctionExtension) writer.varint(3, obj.auctionExtension, int64$i);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1R = writer;

	const _vega_PriceMonitoringTrigger = encode$20;

	encode$21.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1R();

	  if (obj.triggers?.length)
	    obj.triggers.forEach((v) =>
	      writer.bytes(1, _vega_PriceMonitoringTrigger.encode(v))
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$1$ = {};

	var encode$1_ = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1Q = writer;
	const { int64: int64$h, double: double$3 } = types$1;

	encode$1_.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1Q();

	  if (obj.timeWindow) writer.varint(1, obj.timeWindow, int64$h);
	  if (obj.scalingFactor) writer.fixed64(2, obj.scalingFactor, double$3);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1P = writer;
	const { string: string$1h, int64: int64$g } = types$1;
	const _vega_TargetStakeParameters$2 = encode$1_;

	encode$1$.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1P();

	  if (obj.targetStakeParameters)
	    writer.bytes(
	      1,
	      _vega_TargetStakeParameters$2.encode(obj.targetStakeParameters)
	    );
	  if (obj.triggeringRatio) writer.bytes(2, obj.triggeringRatio, string$1h);
	  if (obj.auctionExtension) writer.varint(3, obj.auctionExtension, int64$g);

	  return writer.concat(buf, byteOffset)
	};

	var encode$1Z = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1O = writer;
	const { double: double$2 } = types$1;

	encode$1Z.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1O();

	  if (obj.factorLong) writer.fixed64(1, obj.factorLong, double$2);
	  if (obj.factorShort) writer.fixed64(2, obj.factorShort, double$2);
	  if (obj.maxMoveUp) writer.fixed64(3, obj.maxMoveUp, double$2);
	  if (obj.minMoveDown) writer.fixed64(4, obj.minMoveDown, double$2);
	  if (obj.probabilityOfTrading)
	    writer.fixed64(5, obj.probabilityOfTrading, double$2);

	  return writer.concat(buf, byteOffset)
	};

	var encode$1Y = {};

	var encode$1X = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1N = writer;
	const { double: double$1 } = types$1;

	encode$1X.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1N();

	  if (obj.mu) writer.fixed64(1, obj.mu, double$1);
	  if (obj.r) writer.fixed64(2, obj.r, double$1);
	  if (obj.sigma) writer.fixed64(3, obj.sigma, double$1);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1M = writer;
	const { double } = types$1;
	const _vega_LogNormalModelParams = encode$1X;

	encode$1Y.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1M();

	  if (obj.riskAversionParameter)
	    writer.fixed64(1, obj.riskAversionParameter, double);
	  if (obj.tau) writer.fixed64(2, obj.tau, double);
	  if (obj.params) writer.bytes(3, _vega_LogNormalModelParams.encode(obj.params));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1W = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1L = writer;
	const { string: string$1g, uint64: uint64$k } = types$1;

	encode$1W.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1L();

	  if (obj.priceRange) writer.bytes(1, obj.priceRange, string$1g);
	  if (obj.commitmentMinTimeFraction)
	    writer.bytes(2, obj.commitmentMinTimeFraction, string$1g);
	  if (obj.performanceHysteresisEpochs)
	    writer.varint(4, obj.performanceHysteresisEpochs, uint64$k);
	  if (obj.slaCompetitionFactor)
	    writer.bytes(5, obj.slaCompetitionFactor, string$1g);

	  return writer.concat(buf, byteOffset)
	};

	var encode$1V = {};

	/// autogenerated by protoc-plugin-js
	const assert$g = nanoassert;
	const { enumerable: enumerable$g } = types$1;
	const { enumerable: decodeEnumerable$g } = types;

	const METHOD_UNSPECIFIED$1 = 0;
	const METHOD_MARGINAL_COST = 1;
	const METHOD_WEIGHTED_AVERAGE = 2;
	const METHOD_CONSTANT = 3;

	const enumValues$g = new Map([
	  [0, 'METHOD_UNSPECIFIED'],
	  [1, 'METHOD_MARGINAL_COST'],
	  [2, 'METHOD_WEIGHTED_AVERAGE'],
	  [3, 'METHOD_CONSTANT']
	]);
	const enumNames$g = new Map([
	  ['METHOD_UNSPECIFIED', 0],
	  ['METHOD_MARGINAL_COST', 1],
	  ['METHOD_WEIGHTED_AVERAGE', 2],
	  ['METHOD_CONSTANT', 3]
	]);

	function encode$1U(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$1U(parse$g(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid Method value (' + value + ')')

	  return enumerable$g.encode(value, buf, byteOffset)
	}

	function decode$g(varint) {
	  const int = decodeEnumerable$g(varint);

	  return stringify$g(int) ?? int
	}

	function encodingLength$g(value) {
	  if (typeof value === 'string') return encodingLength$g(parse$g(value))
	  assert$g(value != null, 'Invalid Method value (' + value + ')');

	  if (0 <= value && value <= 3) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$g(int) {
	  return enumValues$g.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$g(str) {
	  return enumNames$g.get(str)
	}

	var Method$1 = {
	  encode: encode$1U,
	  decode: decode$g,
	  encodingLength: encodingLength$g,
	  stringify: stringify$g,
	  parse: parse$g,
	  METHOD_UNSPECIFIED: METHOD_UNSPECIFIED$1,
	  METHOD_MARGINAL_COST,
	  METHOD_WEIGHTED_AVERAGE,
	  METHOD_CONSTANT
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1K = writer;
	const { string: string$1f } = types$1;
	const _vega_LiquidityFeeSettings_Method = Method$1;

	encode$1V.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1K();

	  if (obj.method)
	    writer.varint(1, obj.method, _vega_LiquidityFeeSettings_Method);
	  if (obj.feeConstant) writer.bytes(2, obj.feeConstant, string$1f);

	  return writer.concat(buf, byteOffset)
	};

	var encode$1T = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1J = writer;
	const { int64: int64$f, string: string$1e, uint64: uint64$j } = types$1;

	encode$1T.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1J();

	  if (obj.disposalTimeStep) writer.varint(1, obj.disposalTimeStep, int64$f);
	  if (obj.disposalFraction) writer.bytes(2, obj.disposalFraction, string$1e);
	  if (obj.fullDisposalSize) writer.varint(3, obj.fullDisposalSize, uint64$j);
	  if (obj.maxFractionConsumed) writer.bytes(4, obj.maxFractionConsumed, string$1e);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1I = writer;
	const { string: string$1d } = types$1;
	const _vega_UpdateInstrumentConfiguration = encode$2x;
	const _vega_PriceMonitoringParameters$3 = encode$21;
	const _vega_LiquidityMonitoringParameters$1 = encode$1$;
	const _vega_SimpleModelParams$3 = encode$1Z;
	const _vega_LogNormalRiskModel$3 = encode$1Y;
	const _vega_LiquiditySLAParameters$3 = encode$1W;
	const _vega_LiquidityFeeSettings$3 = encode$1V;
	const _vega_LiquidationStrategy$1 = encode$1T;
	const _vega_CompositePriceConfiguration$2 = encode$24;

	encode$2y.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1I();

	  if (obj.instrument)
	    writer.bytes(1, _vega_UpdateInstrumentConfiguration.encode(obj.instrument));
	  if (obj.metadata?.length)
	    obj.metadata.forEach((v) => writer.bytes(2, v, string$1d));
	  if (obj.priceMonitoringParameters)
	    writer.bytes(
	      3,
	      _vega_PriceMonitoringParameters$3.encode(obj.priceMonitoringParameters)
	    );
	  if (obj.liquidityMonitoringParameters)
	    writer.bytes(
	      4,
	      _vega_LiquidityMonitoringParameters$1.encode(
	        obj.liquidityMonitoringParameters
	      )
	    );
	  if (obj.lpPriceRange) writer.bytes(5, obj.lpPriceRange, string$1d);
	  if (obj.linearSlippageFactor)
	    writer.bytes(6, obj.linearSlippageFactor, string$1d);
	  if (obj.quadraticSlippageFactor)
	    writer.bytes(7, obj.quadraticSlippageFactor, string$1d);
	  if (obj.liquiditySlaParameters)
	    writer.bytes(
	      8,
	      _vega_LiquiditySLAParameters$3.encode(obj.liquiditySlaParameters)
	    );
	  if (obj.liquidityFeeSettings)
	    writer.bytes(9, _vega_LiquidityFeeSettings$3.encode(obj.liquidityFeeSettings));
	  if (obj.liquidationStrategy)
	    writer.bytes(10, _vega_LiquidationStrategy$1.encode(obj.liquidationStrategy));
	  if (obj.markPriceConfiguration)
	    writer.bytes(
	      11,
	      _vega_CompositePriceConfiguration$2.encode(obj.markPriceConfiguration)
	    );

	  if (obj.riskParameters?.simple ?? obj.simple)
	    writer.bytes(
	      100,
	      _vega_SimpleModelParams$3.encode(obj.riskParameters?.simple ?? obj.simple)
	    );
	  if (obj.riskParameters?.logNormal ?? obj.logNormal)
	    writer.bytes(
	      101,
	      _vega_LogNormalRiskModel$3.encode(
	        obj.riskParameters?.logNormal ?? obj.logNormal
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1H = writer;
	const { string: string$1c } = types$1;
	const _vega_UpdateMarketConfiguration = encode$2y;

	encode$2z.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1H();

	  if (obj.marketId) writer.bytes(1, obj.marketId, string$1c);
	  if (obj.changes)
	    writer.bytes(2, _vega_UpdateMarketConfiguration.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1S = {};

	var encode$1R = {};

	var encode$1Q = {};

	var encode$1P = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1G = writer;
	const { string: string$1b } = types$1;
	const _vega_DataSourceDefinition$1 = encode$2v;
	const _vega_DataSourceSpecToFutureBinding = encode$27;

	encode$1P.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1G();

	  if (obj.settlementAsset) writer.bytes(1, obj.settlementAsset, string$1b);
	  if (obj.quoteName) writer.bytes(2, obj.quoteName, string$1b);
	  if (obj.dataSourceSpecForSettlementData)
	    writer.bytes(
	      3,
	      _vega_DataSourceDefinition$1.encode(obj.dataSourceSpecForSettlementData)
	    );
	  if (obj.dataSourceSpecForTradingTermination)
	    writer.bytes(
	      4,
	      _vega_DataSourceDefinition$1.encode(obj.dataSourceSpecForTradingTermination)
	    );
	  if (obj.dataSourceSpecBinding)
	    writer.bytes(
	      5,
	      _vega_DataSourceSpecToFutureBinding.encode(obj.dataSourceSpecBinding)
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$1O = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1F = writer;
	const { string: string$1a } = types$1;

	encode$1O.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1F();

	  if (obj.baseAsset) writer.bytes(1, obj.baseAsset, string$1a);
	  if (obj.quoteAsset) writer.bytes(2, obj.quoteAsset, string$1a);
	  if (obj.name) writer.bytes(3, obj.name, string$1a);

	  return writer.concat(buf, byteOffset)
	};

	var encode$1N = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1E = writer;
	const { string: string$19 } = types$1;
	const _vega_DataSourceDefinition = encode$2v;
	const _vega_DataSourceSpecToPerpetualBinding = encode$25;
	const _vega_CompositePriceConfiguration$1 = encode$24;

	encode$1N.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1E();

	  if (obj.settlementAsset) writer.bytes(1, obj.settlementAsset, string$19);
	  if (obj.quoteName) writer.bytes(2, obj.quoteName, string$19);
	  if (obj.marginFundingFactor) writer.bytes(3, obj.marginFundingFactor, string$19);
	  if (obj.interestRate) writer.bytes(4, obj.interestRate, string$19);
	  if (obj.clampLowerBound) writer.bytes(5, obj.clampLowerBound, string$19);
	  if (obj.clampUpperBound) writer.bytes(6, obj.clampUpperBound, string$19);
	  if (obj.dataSourceSpecForSettlementSchedule)
	    writer.bytes(
	      7,
	      _vega_DataSourceDefinition.encode(obj.dataSourceSpecForSettlementSchedule)
	    );
	  if (obj.dataSourceSpecForSettlementData)
	    writer.bytes(
	      8,
	      _vega_DataSourceDefinition.encode(obj.dataSourceSpecForSettlementData)
	    );
	  if (obj.dataSourceSpecBinding)
	    writer.bytes(
	      9,
	      _vega_DataSourceSpecToPerpetualBinding.encode(obj.dataSourceSpecBinding)
	    );
	  if (obj.fundingRateScalingFactor)
	    writer.bytes(10, obj.fundingRateScalingFactor, string$19);
	  if (obj.fundingRateLowerBound)
	    writer.bytes(11, obj.fundingRateLowerBound, string$19);
	  if (obj.fundingRateUpperBound)
	    writer.bytes(12, obj.fundingRateUpperBound, string$19);
	  if (obj.internalCompositePriceConfiguration)
	    writer.bytes(
	      13,
	      _vega_CompositePriceConfiguration$1.encode(
	        obj.internalCompositePriceConfiguration
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1D = writer;
	const { string: string$18 } = types$1;
	const _vega_FutureProduct = encode$1P;
	const _vega_SpotProduct = encode$1O;
	const _vega_PerpetualProduct = encode$1N;

	encode$1Q.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1D();

	  if (obj.name) writer.bytes(1, obj.name, string$18);
	  if (obj.code) writer.bytes(2, obj.code, string$18);

	  if (obj.product?.future ?? obj.future)
	    writer.bytes(
	      100,
	      _vega_FutureProduct.encode(obj.product?.future ?? obj.future)
	    );
	  if (obj.product?.spot ?? obj.spot)
	    writer.bytes(101, _vega_SpotProduct.encode(obj.product?.spot ?? obj.spot));
	  if (obj.product?.perpetual ?? obj.perpetual)
	    writer.bytes(
	      102,
	      _vega_PerpetualProduct.encode(obj.product?.perpetual ?? obj.perpetual)
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$1M = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1C = writer;
	const { string: string$17 } = types$1;

	encode$1M.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1C();

	  if (obj.parentMarketId) writer.bytes(1, obj.parentMarketId, string$17);
	  if (obj.insurancePoolFraction)
	    writer.bytes(2, obj.insurancePoolFraction, string$17);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1B = writer;
	const { uint64: uint64$i, string: string$16, int64: int64$e } = types$1;
	const _vega_InstrumentConfiguration$1 = encode$1Q;
	const _vega_PriceMonitoringParameters$2 = encode$21;
	const _vega_LiquidityMonitoringParameters = encode$1$;
	const _vega_SimpleModelParams$2 = encode$1Z;
	const _vega_LogNormalRiskModel$2 = encode$1Y;
	const _vega_SuccessorConfiguration = encode$1M;
	const _vega_LiquiditySLAParameters$2 = encode$1W;
	const _vega_LiquidityFeeSettings$2 = encode$1V;
	const _vega_LiquidationStrategy = encode$1T;
	const _vega_CompositePriceConfiguration = encode$24;

	encode$1R.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1B();

	  if (obj.instrument)
	    writer.bytes(1, _vega_InstrumentConfiguration$1.encode(obj.instrument));
	  if (obj.decimalPlaces) writer.varint(2, obj.decimalPlaces, uint64$i);
	  if (obj.metadata?.length)
	    obj.metadata.forEach((v) => writer.bytes(3, v, string$16));
	  if (obj.priceMonitoringParameters)
	    writer.bytes(
	      4,
	      _vega_PriceMonitoringParameters$2.encode(obj.priceMonitoringParameters)
	    );
	  if (obj.liquidityMonitoringParameters)
	    writer.bytes(
	      5,
	      _vega_LiquidityMonitoringParameters.encode(
	        obj.liquidityMonitoringParameters
	      )
	    );
	  if (obj.positionDecimalPlaces)
	    writer.varint(6, obj.positionDecimalPlaces, int64$e);
	  if (obj.lpPriceRange) writer.bytes(8, obj.lpPriceRange, string$16);
	  if (obj.linearSlippageFactor)
	    writer.bytes(9, obj.linearSlippageFactor, string$16);
	  if (obj.quadraticSlippageFactor)
	    writer.bytes(10, obj.quadraticSlippageFactor, string$16);
	  if (obj.successor)
	    writer.bytes(11, _vega_SuccessorConfiguration.encode(obj.successor));
	  if (obj.liquiditySlaParameters)
	    writer.bytes(
	      12,
	      _vega_LiquiditySLAParameters$2.encode(obj.liquiditySlaParameters)
	    );
	  if (obj.liquidityFeeSettings)
	    writer.bytes(
	      13,
	      _vega_LiquidityFeeSettings$2.encode(obj.liquidityFeeSettings)
	    );
	  if (obj.liquidationStrategy)
	    writer.bytes(14, _vega_LiquidationStrategy.encode(obj.liquidationStrategy));
	  if (obj.markPriceConfiguration)
	    writer.bytes(
	      15,
	      _vega_CompositePriceConfiguration.encode(obj.markPriceConfiguration)
	    );

	  if (obj.riskParameters?.simple ?? obj.simple)
	    writer.bytes(
	      100,
	      _vega_SimpleModelParams$2.encode(obj.riskParameters?.simple ?? obj.simple)
	    );
	  if (obj.riskParameters?.logNormal ?? obj.logNormal)
	    writer.bytes(
	      101,
	      _vega_LogNormalRiskModel$2.encode(
	        obj.riskParameters?.logNormal ?? obj.logNormal
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1A = writer;

	const _vega_NewMarketConfiguration = encode$1R;

	encode$1S.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1A();

	  if (obj.changes)
	    writer.bytes(1, _vega_NewMarketConfiguration.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1L = {};

	var encode$1K = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1z = writer;
	const { string: string$15 } = types$1;

	encode$1K.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1z();

	  if (obj.key) writer.bytes(1, obj.key, string$15);
	  if (obj.value) writer.bytes(2, obj.value, string$15);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1y = writer;

	const _vega_NetworkParameter = encode$1K;

	encode$1L.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1y();

	  if (obj.changes) writer.bytes(1, _vega_NetworkParameter.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1J = {};

	var encode$1I = {};

	var encode$1H = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1x = writer;
	const { string: string$14 } = types$1;

	encode$1H.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1x();

	  if (obj.maxFaucetAmountMint) writer.bytes(1, obj.maxFaucetAmountMint, string$14);

	  return writer.concat(buf, byteOffset)
	};

	var encode$1G = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1w = writer;
	const { string: string$13 } = types$1;

	encode$1G.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1w();

	  if (obj.contractAddress) writer.bytes(1, obj.contractAddress, string$13);
	  if (obj.lifetimeLimit) writer.bytes(2, obj.lifetimeLimit, string$13);
	  if (obj.withdrawThreshold) writer.bytes(3, obj.withdrawThreshold, string$13);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1v = writer;
	const { string: string$12, uint64: uint64$h } = types$1;
	const _vega_BuiltinAsset = encode$1H;
	const _vega_ERC20 = encode$1G;

	encode$1I.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1v();

	  if (obj.name) writer.bytes(1, obj.name, string$12);
	  if (obj.symbol) writer.bytes(2, obj.symbol, string$12);
	  if (obj.decimals) writer.varint(4, obj.decimals, uint64$h);
	  if (obj.quantum) writer.bytes(5, obj.quantum, string$12);

	  if (obj.source?.builtinAsset ?? obj.builtinAsset)
	    writer.bytes(
	      101,
	      _vega_BuiltinAsset.encode(obj.source?.builtinAsset ?? obj.builtinAsset)
	    );
	  if (obj.source?.erc20 ?? obj.erc20)
	    writer.bytes(102, _vega_ERC20.encode(obj.source?.erc20 ?? obj.erc20));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1u = writer;

	const _vega_AssetDetails = encode$1I;

	encode$1J.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1u();

	  if (obj.changes) writer.bytes(1, _vega_AssetDetails.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1F = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1t = writer;

	encode$1F.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1t();

	  return writer.concat(buf, byteOffset)
	};

	var encode$1E = {};

	var encode$1D = {};

	var encode$1C = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1s = writer;
	const { string: string$11 } = types$1;

	encode$1C.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1s();

	  if (obj.lifetimeLimit) writer.bytes(1, obj.lifetimeLimit, string$11);
	  if (obj.withdrawThreshold) writer.bytes(2, obj.withdrawThreshold, string$11);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1r = writer;
	const { string: string$10 } = types$1;
	const _vega_ERC20Update = encode$1C;

	encode$1D.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1r();

	  if (obj.quantum) writer.bytes(5, obj.quantum, string$10);

	  if (obj.source?.erc20 ?? obj.erc20)
	    writer.bytes(101, _vega_ERC20Update.encode(obj.source?.erc20 ?? obj.erc20));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1q = writer;
	const { string: string$$ } = types$1;
	const _vega_AssetDetailsUpdate = encode$1D;

	encode$1E.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1q();

	  if (obj.assetId) writer.bytes(1, obj.assetId, string$$);
	  if (obj.changes) writer.bytes(2, _vega_AssetDetailsUpdate.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1B = {};

	var encode$1A = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1p = writer;
	const { uint64: uint64$g, string: string$_, int64: int64$d } = types$1;
	const _vega_InstrumentConfiguration = encode$1Q;
	const _vega_PriceMonitoringParameters$1 = encode$21;
	const _vega_TargetStakeParameters$1 = encode$1_;
	const _vega_SimpleModelParams$1 = encode$1Z;
	const _vega_LogNormalRiskModel$1 = encode$1Y;
	const _vega_LiquiditySLAParameters$1 = encode$1W;
	const _vega_LiquidityFeeSettings$1 = encode$1V;

	encode$1A.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1p();

	  if (obj.instrument)
	    writer.bytes(1, _vega_InstrumentConfiguration.encode(obj.instrument));
	  if (obj.decimalPlaces) writer.varint(2, obj.decimalPlaces, uint64$g);
	  if (obj.metadata?.length)
	    obj.metadata.forEach((v) => writer.bytes(3, v, string$_));
	  if (obj.priceMonitoringParameters)
	    writer.bytes(
	      4,
	      _vega_PriceMonitoringParameters$1.encode(obj.priceMonitoringParameters)
	    );
	  if (obj.targetStakeParameters)
	    writer.bytes(
	      5,
	      _vega_TargetStakeParameters$1.encode(obj.targetStakeParameters)
	    );
	  if (obj.positionDecimalPlaces)
	    writer.varint(6, obj.positionDecimalPlaces, int64$d);
	  if (obj.slaParams)
	    writer.bytes(7, _vega_LiquiditySLAParameters$1.encode(obj.slaParams));
	  if (obj.liquidityFeeSettings)
	    writer.bytes(8, _vega_LiquidityFeeSettings$1.encode(obj.liquidityFeeSettings));

	  if (obj.riskParameters?.simple ?? obj.simple)
	    writer.bytes(
	      100,
	      _vega_SimpleModelParams$1.encode(obj.riskParameters?.simple ?? obj.simple)
	    );
	  if (obj.riskParameters?.logNormal ?? obj.logNormal)
	    writer.bytes(
	      101,
	      _vega_LogNormalRiskModel$1.encode(
	        obj.riskParameters?.logNormal ?? obj.logNormal
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1o = writer;

	const _vega_NewSpotMarketConfiguration = encode$1A;

	encode$1B.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1o();

	  if (obj.changes)
	    writer.bytes(1, _vega_NewSpotMarketConfiguration.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1z = {};

	var encode$1y = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1n = writer;
	const { string: string$Z } = types$1;
	const _vega_PriceMonitoringParameters = encode$21;
	const _vega_TargetStakeParameters = encode$1_;
	const _vega_SimpleModelParams = encode$1Z;
	const _vega_LogNormalRiskModel = encode$1Y;
	const _vega_LiquiditySLAParameters = encode$1W;
	const _vega_LiquidityFeeSettings = encode$1V;

	encode$1y.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1n();

	  if (obj.metadata?.length)
	    obj.metadata.forEach((v) => writer.bytes(1, v, string$Z));
	  if (obj.priceMonitoringParameters)
	    writer.bytes(
	      2,
	      _vega_PriceMonitoringParameters.encode(obj.priceMonitoringParameters)
	    );
	  if (obj.targetStakeParameters)
	    writer.bytes(
	      3,
	      _vega_TargetStakeParameters.encode(obj.targetStakeParameters)
	    );
	  if (obj.slaParams)
	    writer.bytes(4, _vega_LiquiditySLAParameters.encode(obj.slaParams));
	  if (obj.liquidityFeeSettings)
	    writer.bytes(5, _vega_LiquidityFeeSettings.encode(obj.liquidityFeeSettings));

	  if (obj.riskParameters?.simple ?? obj.simple)
	    writer.bytes(
	      100,
	      _vega_SimpleModelParams.encode(obj.riskParameters?.simple ?? obj.simple)
	    );
	  if (obj.riskParameters?.logNormal ?? obj.logNormal)
	    writer.bytes(
	      101,
	      _vega_LogNormalRiskModel.encode(
	        obj.riskParameters?.logNormal ?? obj.logNormal
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1m = writer;
	const { string: string$Y } = types$1;
	const _vega_UpdateSpotMarketConfiguration = encode$1y;

	encode$1z.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1m();

	  if (obj.marketId) writer.bytes(1, obj.marketId, string$Y);
	  if (obj.changes)
	    writer.bytes(2, _vega_UpdateSpotMarketConfiguration.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1x = {};

	var encode$1w = {};

	/// autogenerated by protoc-plugin-js
	const assert$f = nanoassert;
	const { enumerable: enumerable$f } = types$1;
	const { enumerable: decodeEnumerable$f } = types;

	const ACCOUNT_TYPE_UNSPECIFIED = 0;
	const ACCOUNT_TYPE_INSURANCE = 1;
	const ACCOUNT_TYPE_SETTLEMENT = 2;
	const ACCOUNT_TYPE_MARGIN = 3;
	const ACCOUNT_TYPE_GENERAL = 4;
	const ACCOUNT_TYPE_FEES_INFRASTRUCTURE = 5;
	const ACCOUNT_TYPE_FEES_LIQUIDITY = 6;
	const ACCOUNT_TYPE_FEES_MAKER = 7;
	const ACCOUNT_TYPE_BOND = 9;
	const ACCOUNT_TYPE_EXTERNAL = 10;
	const ACCOUNT_TYPE_GLOBAL_INSURANCE = 11;
	const ACCOUNT_TYPE_GLOBAL_REWARD = 12;
	const ACCOUNT_TYPE_PENDING_TRANSFERS = 13;
	const ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES = 14;
	const ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES = 15;
	const ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES = 16;
	const ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS = 17;
	const ACCOUNT_TYPE_HOLDING = 18;
	const ACCOUNT_TYPE_LP_LIQUIDITY_FEES = 19;
	const ACCOUNT_TYPE_LIQUIDITY_FEES_BONUS_DISTRIBUTION = 20;
	const ACCOUNT_TYPE_NETWORK_TREASURY = 21;
	const ACCOUNT_TYPE_VESTING_REWARDS = 22;
	const ACCOUNT_TYPE_VESTED_REWARDS = 23;
	const ACCOUNT_TYPE_REWARD_AVERAGE_POSITION = 24;
	const ACCOUNT_TYPE_REWARD_RELATIVE_RETURN = 25;
	const ACCOUNT_TYPE_REWARD_RETURN_VOLATILITY = 26;
	const ACCOUNT_TYPE_REWARD_VALIDATOR_RANKING = 27;
	const ACCOUNT_TYPE_PENDING_FEE_REFERRAL_REWARD = 28;
	const ACCOUNT_TYPE_ORDER_MARGIN = 29;

	const enumValues$f = new Map([
	  [0, 'ACCOUNT_TYPE_UNSPECIFIED'],
	  [1, 'ACCOUNT_TYPE_INSURANCE'],
	  [2, 'ACCOUNT_TYPE_SETTLEMENT'],
	  [3, 'ACCOUNT_TYPE_MARGIN'],
	  [4, 'ACCOUNT_TYPE_GENERAL'],
	  [5, 'ACCOUNT_TYPE_FEES_INFRASTRUCTURE'],
	  [6, 'ACCOUNT_TYPE_FEES_LIQUIDITY'],
	  [7, 'ACCOUNT_TYPE_FEES_MAKER'],
	  [9, 'ACCOUNT_TYPE_BOND'],
	  [10, 'ACCOUNT_TYPE_EXTERNAL'],
	  [11, 'ACCOUNT_TYPE_GLOBAL_INSURANCE'],
	  [12, 'ACCOUNT_TYPE_GLOBAL_REWARD'],
	  [13, 'ACCOUNT_TYPE_PENDING_TRANSFERS'],
	  [14, 'ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES'],
	  [15, 'ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES'],
	  [16, 'ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES'],
	  [17, 'ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS'],
	  [18, 'ACCOUNT_TYPE_HOLDING'],
	  [19, 'ACCOUNT_TYPE_LP_LIQUIDITY_FEES'],
	  [20, 'ACCOUNT_TYPE_LIQUIDITY_FEES_BONUS_DISTRIBUTION'],
	  [21, 'ACCOUNT_TYPE_NETWORK_TREASURY'],
	  [22, 'ACCOUNT_TYPE_VESTING_REWARDS'],
	  [23, 'ACCOUNT_TYPE_VESTED_REWARDS'],
	  [24, 'ACCOUNT_TYPE_REWARD_AVERAGE_POSITION'],
	  [25, 'ACCOUNT_TYPE_REWARD_RELATIVE_RETURN'],
	  [26, 'ACCOUNT_TYPE_REWARD_RETURN_VOLATILITY'],
	  [27, 'ACCOUNT_TYPE_REWARD_VALIDATOR_RANKING'],
	  [28, 'ACCOUNT_TYPE_PENDING_FEE_REFERRAL_REWARD'],
	  [29, 'ACCOUNT_TYPE_ORDER_MARGIN']
	]);
	const enumNames$f = new Map([
	  ['ACCOUNT_TYPE_UNSPECIFIED', 0],
	  ['ACCOUNT_TYPE_INSURANCE', 1],
	  ['ACCOUNT_TYPE_SETTLEMENT', 2],
	  ['ACCOUNT_TYPE_MARGIN', 3],
	  ['ACCOUNT_TYPE_GENERAL', 4],
	  ['ACCOUNT_TYPE_FEES_INFRASTRUCTURE', 5],
	  ['ACCOUNT_TYPE_FEES_LIQUIDITY', 6],
	  ['ACCOUNT_TYPE_FEES_MAKER', 7],
	  ['ACCOUNT_TYPE_BOND', 9],
	  ['ACCOUNT_TYPE_EXTERNAL', 10],
	  ['ACCOUNT_TYPE_GLOBAL_INSURANCE', 11],
	  ['ACCOUNT_TYPE_GLOBAL_REWARD', 12],
	  ['ACCOUNT_TYPE_PENDING_TRANSFERS', 13],
	  ['ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES', 14],
	  ['ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES', 15],
	  ['ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES', 16],
	  ['ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS', 17],
	  ['ACCOUNT_TYPE_HOLDING', 18],
	  ['ACCOUNT_TYPE_LP_LIQUIDITY_FEES', 19],
	  ['ACCOUNT_TYPE_LIQUIDITY_FEES_BONUS_DISTRIBUTION', 20],
	  ['ACCOUNT_TYPE_NETWORK_TREASURY', 21],
	  ['ACCOUNT_TYPE_VESTING_REWARDS', 22],
	  ['ACCOUNT_TYPE_VESTED_REWARDS', 23],
	  ['ACCOUNT_TYPE_REWARD_AVERAGE_POSITION', 24],
	  ['ACCOUNT_TYPE_REWARD_RELATIVE_RETURN', 25],
	  ['ACCOUNT_TYPE_REWARD_RETURN_VOLATILITY', 26],
	  ['ACCOUNT_TYPE_REWARD_VALIDATOR_RANKING', 27],
	  ['ACCOUNT_TYPE_PENDING_FEE_REFERRAL_REWARD', 28],
	  ['ACCOUNT_TYPE_ORDER_MARGIN', 29]
	]);

	function encode$1v(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$1v(parse$f(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid AccountType value (' + value + ')')

	  return enumerable$f.encode(value, buf, byteOffset)
	}

	function decode$f(varint) {
	  const int = decodeEnumerable$f(varint);

	  return stringify$f(int) ?? int
	}

	function encodingLength$f(value) {
	  if (typeof value === 'string') return encodingLength$f(parse$f(value))
	  assert$f(value != null, 'Invalid AccountType value (' + value + ')');

	  if (0 <= value && value <= 29) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$f(int) {
	  return enumValues$f.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$f(str) {
	  return enumNames$f.get(str)
	}

	var AccountType = {
	  encode: encode$1v,
	  decode: decode$f,
	  encodingLength: encodingLength$f,
	  stringify: stringify$f,
	  parse: parse$f,
	  ACCOUNT_TYPE_UNSPECIFIED,
	  ACCOUNT_TYPE_INSURANCE,
	  ACCOUNT_TYPE_SETTLEMENT,
	  ACCOUNT_TYPE_MARGIN,
	  ACCOUNT_TYPE_GENERAL,
	  ACCOUNT_TYPE_FEES_INFRASTRUCTURE,
	  ACCOUNT_TYPE_FEES_LIQUIDITY,
	  ACCOUNT_TYPE_FEES_MAKER,
	  ACCOUNT_TYPE_BOND,
	  ACCOUNT_TYPE_EXTERNAL,
	  ACCOUNT_TYPE_GLOBAL_INSURANCE,
	  ACCOUNT_TYPE_GLOBAL_REWARD,
	  ACCOUNT_TYPE_PENDING_TRANSFERS,
	  ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES,
	  ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES,
	  ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES,
	  ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS,
	  ACCOUNT_TYPE_HOLDING,
	  ACCOUNT_TYPE_LP_LIQUIDITY_FEES,
	  ACCOUNT_TYPE_LIQUIDITY_FEES_BONUS_DISTRIBUTION,
	  ACCOUNT_TYPE_NETWORK_TREASURY,
	  ACCOUNT_TYPE_VESTING_REWARDS,
	  ACCOUNT_TYPE_VESTED_REWARDS,
	  ACCOUNT_TYPE_REWARD_AVERAGE_POSITION,
	  ACCOUNT_TYPE_REWARD_RELATIVE_RETURN,
	  ACCOUNT_TYPE_REWARD_RETURN_VOLATILITY,
	  ACCOUNT_TYPE_REWARD_VALIDATOR_RANKING,
	  ACCOUNT_TYPE_PENDING_FEE_REFERRAL_REWARD,
	  ACCOUNT_TYPE_ORDER_MARGIN
	};

	/// autogenerated by protoc-plugin-js
	const assert$e = nanoassert;
	const { enumerable: enumerable$e } = types$1;
	const { enumerable: decodeEnumerable$e } = types;

	const GOVERNANCE_TRANSFER_TYPE_UNSPECIFIED = 0;
	const GOVERNANCE_TRANSFER_TYPE_ALL_OR_NOTHING = 1;
	const GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT = 2;

	const enumValues$e = new Map([
	  [0, 'GOVERNANCE_TRANSFER_TYPE_UNSPECIFIED'],
	  [1, 'GOVERNANCE_TRANSFER_TYPE_ALL_OR_NOTHING'],
	  [2, 'GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT']
	]);
	const enumNames$e = new Map([
	  ['GOVERNANCE_TRANSFER_TYPE_UNSPECIFIED', 0],
	  ['GOVERNANCE_TRANSFER_TYPE_ALL_OR_NOTHING', 1],
	  ['GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT', 2]
	]);

	function encode$1u(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$1u(parse$e(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid GovernanceTransferType value (' + value + ')')

	  return enumerable$e.encode(value, buf, byteOffset)
	}

	function decode$e(varint) {
	  const int = decodeEnumerable$e(varint);

	  return stringify$e(int) ?? int
	}

	function encodingLength$e(value) {
	  if (typeof value === 'string') return encodingLength$e(parse$e(value))
	  assert$e(value != null, 'Invalid GovernanceTransferType value (' + value + ')');

	  if (0 <= value && value <= 2) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$e(int) {
	  return enumValues$e.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$e(str) {
	  return enumNames$e.get(str)
	}

	var GovernanceTransferType = {
	  encode: encode$1u,
	  decode: decode$e,
	  encodingLength: encodingLength$e,
	  stringify: stringify$e,
	  parse: parse$e,
	  GOVERNANCE_TRANSFER_TYPE_UNSPECIFIED,
	  GOVERNANCE_TRANSFER_TYPE_ALL_OR_NOTHING,
	  GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT
	};

	var encode$1t = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1l = writer;
	const { int64: int64$c } = types$1;

	encode$1t.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1l();

	  if (obj.deliverOn) writer.varint(1, obj.deliverOn, int64$c);

	  return writer.concat(buf, byteOffset)
	};

	var encode$1s = {};

	var encode$1r = {};

	/// autogenerated by protoc-plugin-js
	const assert$d = nanoassert;
	const { enumerable: enumerable$d } = types$1;
	const { enumerable: decodeEnumerable$d } = types;

	const DISPATCH_METRIC_UNSPECIFIED = 0;
	const DISPATCH_METRIC_MAKER_FEES_PAID = 1;
	const DISPATCH_METRIC_MAKER_FEES_RECEIVED = 2;
	const DISPATCH_METRIC_LP_FEES_RECEIVED = 3;
	const DISPATCH_METRIC_MARKET_VALUE = 4;
	const DISPATCH_METRIC_AVERAGE_POSITION = 5;
	const DISPATCH_METRIC_RELATIVE_RETURN = 6;
	const DISPATCH_METRIC_RETURN_VOLATILITY = 7;
	const DISPATCH_METRIC_VALIDATOR_RANKING = 8;

	const enumValues$d = new Map([
	  [0, 'DISPATCH_METRIC_UNSPECIFIED'],
	  [1, 'DISPATCH_METRIC_MAKER_FEES_PAID'],
	  [2, 'DISPATCH_METRIC_MAKER_FEES_RECEIVED'],
	  [3, 'DISPATCH_METRIC_LP_FEES_RECEIVED'],
	  [4, 'DISPATCH_METRIC_MARKET_VALUE'],
	  [5, 'DISPATCH_METRIC_AVERAGE_POSITION'],
	  [6, 'DISPATCH_METRIC_RELATIVE_RETURN'],
	  [7, 'DISPATCH_METRIC_RETURN_VOLATILITY'],
	  [8, 'DISPATCH_METRIC_VALIDATOR_RANKING']
	]);
	const enumNames$d = new Map([
	  ['DISPATCH_METRIC_UNSPECIFIED', 0],
	  ['DISPATCH_METRIC_MAKER_FEES_PAID', 1],
	  ['DISPATCH_METRIC_MAKER_FEES_RECEIVED', 2],
	  ['DISPATCH_METRIC_LP_FEES_RECEIVED', 3],
	  ['DISPATCH_METRIC_MARKET_VALUE', 4],
	  ['DISPATCH_METRIC_AVERAGE_POSITION', 5],
	  ['DISPATCH_METRIC_RELATIVE_RETURN', 6],
	  ['DISPATCH_METRIC_RETURN_VOLATILITY', 7],
	  ['DISPATCH_METRIC_VALIDATOR_RANKING', 8]
	]);

	function encode$1q(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$1q(parse$d(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid DispatchMetric value (' + value + ')')

	  return enumerable$d.encode(value, buf, byteOffset)
	}

	function decode$d(varint) {
	  const int = decodeEnumerable$d(varint);

	  return stringify$d(int) ?? int
	}

	function encodingLength$d(value) {
	  if (typeof value === 'string') return encodingLength$d(parse$d(value))
	  assert$d(value != null, 'Invalid DispatchMetric value (' + value + ')');

	  if (0 <= value && value <= 8) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$d(int) {
	  return enumValues$d.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$d(str) {
	  return enumNames$d.get(str)
	}

	var DispatchMetric = {
	  encode: encode$1q,
	  decode: decode$d,
	  encodingLength: encodingLength$d,
	  stringify: stringify$d,
	  parse: parse$d,
	  DISPATCH_METRIC_UNSPECIFIED,
	  DISPATCH_METRIC_MAKER_FEES_PAID,
	  DISPATCH_METRIC_MAKER_FEES_RECEIVED,
	  DISPATCH_METRIC_LP_FEES_RECEIVED,
	  DISPATCH_METRIC_MARKET_VALUE,
	  DISPATCH_METRIC_AVERAGE_POSITION,
	  DISPATCH_METRIC_RELATIVE_RETURN,
	  DISPATCH_METRIC_RETURN_VOLATILITY,
	  DISPATCH_METRIC_VALIDATOR_RANKING
	};

	/// autogenerated by protoc-plugin-js
	const assert$c = nanoassert;
	const { enumerable: enumerable$c } = types$1;
	const { enumerable: decodeEnumerable$c } = types;

	const ENTITY_SCOPE_UNSPECIFIED = 0;
	const ENTITY_SCOPE_INDIVIDUALS = 1;
	const ENTITY_SCOPE_TEAMS = 2;

	const enumValues$c = new Map([
	  [0, 'ENTITY_SCOPE_UNSPECIFIED'],
	  [1, 'ENTITY_SCOPE_INDIVIDUALS'],
	  [2, 'ENTITY_SCOPE_TEAMS']
	]);
	const enumNames$c = new Map([
	  ['ENTITY_SCOPE_UNSPECIFIED', 0],
	  ['ENTITY_SCOPE_INDIVIDUALS', 1],
	  ['ENTITY_SCOPE_TEAMS', 2]
	]);

	function encode$1p(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$1p(parse$c(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid EntityScope value (' + value + ')')

	  return enumerable$c.encode(value, buf, byteOffset)
	}

	function decode$c(varint) {
	  const int = decodeEnumerable$c(varint);

	  return stringify$c(int) ?? int
	}

	function encodingLength$c(value) {
	  if (typeof value === 'string') return encodingLength$c(parse$c(value))
	  assert$c(value != null, 'Invalid EntityScope value (' + value + ')');

	  if (0 <= value && value <= 2) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$c(int) {
	  return enumValues$c.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$c(str) {
	  return enumNames$c.get(str)
	}

	var EntityScope = {
	  encode: encode$1p,
	  decode: decode$c,
	  encodingLength: encodingLength$c,
	  stringify: stringify$c,
	  parse: parse$c,
	  ENTITY_SCOPE_UNSPECIFIED,
	  ENTITY_SCOPE_INDIVIDUALS,
	  ENTITY_SCOPE_TEAMS
	};

	/// autogenerated by protoc-plugin-js
	const assert$b = nanoassert;
	const { enumerable: enumerable$b } = types$1;
	const { enumerable: decodeEnumerable$b } = types;

	const INDIVIDUAL_SCOPE_UNSPECIFIED = 0;
	const INDIVIDUAL_SCOPE_ALL = 1;
	const INDIVIDUAL_SCOPE_IN_TEAM = 2;
	const INDIVIDUAL_SCOPE_NOT_IN_TEAM = 3;

	const enumValues$b = new Map([
	  [0, 'INDIVIDUAL_SCOPE_UNSPECIFIED'],
	  [1, 'INDIVIDUAL_SCOPE_ALL'],
	  [2, 'INDIVIDUAL_SCOPE_IN_TEAM'],
	  [3, 'INDIVIDUAL_SCOPE_NOT_IN_TEAM']
	]);
	const enumNames$b = new Map([
	  ['INDIVIDUAL_SCOPE_UNSPECIFIED', 0],
	  ['INDIVIDUAL_SCOPE_ALL', 1],
	  ['INDIVIDUAL_SCOPE_IN_TEAM', 2],
	  ['INDIVIDUAL_SCOPE_NOT_IN_TEAM', 3]
	]);

	function encode$1o(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$1o(parse$b(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid IndividualScope value (' + value + ')')

	  return enumerable$b.encode(value, buf, byteOffset)
	}

	function decode$b(varint) {
	  const int = decodeEnumerable$b(varint);

	  return stringify$b(int) ?? int
	}

	function encodingLength$b(value) {
	  if (typeof value === 'string') return encodingLength$b(parse$b(value))
	  assert$b(value != null, 'Invalid IndividualScope value (' + value + ')');

	  if (0 <= value && value <= 3) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$b(int) {
	  return enumValues$b.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$b(str) {
	  return enumNames$b.get(str)
	}

	var IndividualScope = {
	  encode: encode$1o,
	  decode: decode$b,
	  encodingLength: encodingLength$b,
	  stringify: stringify$b,
	  parse: parse$b,
	  INDIVIDUAL_SCOPE_UNSPECIFIED,
	  INDIVIDUAL_SCOPE_ALL,
	  INDIVIDUAL_SCOPE_IN_TEAM,
	  INDIVIDUAL_SCOPE_NOT_IN_TEAM
	};

	/// autogenerated by protoc-plugin-js
	const assert$a = nanoassert;
	const { enumerable: enumerable$a } = types$1;
	const { enumerable: decodeEnumerable$a } = types;

	const DISTRIBUTION_STRATEGY_UNSPECIFIED = 0;
	const DISTRIBUTION_STRATEGY_PRO_RATA = 1;
	const DISTRIBUTION_STRATEGY_RANK = 2;

	const enumValues$a = new Map([
	  [0, 'DISTRIBUTION_STRATEGY_UNSPECIFIED'],
	  [1, 'DISTRIBUTION_STRATEGY_PRO_RATA'],
	  [2, 'DISTRIBUTION_STRATEGY_RANK']
	]);
	const enumNames$a = new Map([
	  ['DISTRIBUTION_STRATEGY_UNSPECIFIED', 0],
	  ['DISTRIBUTION_STRATEGY_PRO_RATA', 1],
	  ['DISTRIBUTION_STRATEGY_RANK', 2]
	]);

	function encode$1n(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$1n(parse$a(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid DistributionStrategy value (' + value + ')')

	  return enumerable$a.encode(value, buf, byteOffset)
	}

	function decode$a(varint) {
	  const int = decodeEnumerable$a(varint);

	  return stringify$a(int) ?? int
	}

	function encodingLength$a(value) {
	  if (typeof value === 'string') return encodingLength$a(parse$a(value))
	  assert$a(value != null, 'Invalid DistributionStrategy value (' + value + ')');

	  if (0 <= value && value <= 2) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$a(int) {
	  return enumValues$a.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$a(str) {
	  return enumNames$a.get(str)
	}

	var DistributionStrategy = {
	  encode: encode$1n,
	  decode: decode$a,
	  encodingLength: encodingLength$a,
	  stringify: stringify$a,
	  parse: parse$a,
	  DISTRIBUTION_STRATEGY_UNSPECIFIED,
	  DISTRIBUTION_STRATEGY_PRO_RATA,
	  DISTRIBUTION_STRATEGY_RANK
	};

	var encode$1m = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1k = writer;
	const { uint32: uint32$4 } = types$1;

	encode$1m.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1k();

	  if (obj.startRank) writer.varint(1, obj.startRank, uint32$4);
	  if (obj.shareRatio) writer.varint(2, obj.shareRatio, uint32$4);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1j = writer;
	const { string: string$X, uint64: uint64$f } = types$1;
	const _vega_DispatchMetric = DispatchMetric;
	const _vega_EntityScope = EntityScope;
	const _vega_IndividualScope = IndividualScope;
	const _vega_DistributionStrategy = DistributionStrategy;
	const _vega_Rank = encode$1m;

	encode$1r.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1j();

	  if (obj.assetForMetric) writer.bytes(1, obj.assetForMetric, string$X);
	  if (obj.metric) writer.varint(2, obj.metric, _vega_DispatchMetric);
	  if (obj.markets?.length)
	    obj.markets.forEach((v) => writer.bytes(3, v, string$X));
	  if (obj.entityScope) writer.varint(4, obj.entityScope, _vega_EntityScope);
	  if (obj.individualScope)
	    writer.varint(5, obj.individualScope, _vega_IndividualScope);
	  if (obj.teamScope?.length)
	    obj.teamScope.forEach((v) => writer.bytes(6, v, string$X));
	  if (obj.nTopPerformers) writer.bytes(7, obj.nTopPerformers, string$X);
	  if (obj.stakingRequirement) writer.bytes(8, obj.stakingRequirement, string$X);
	  if (obj.notionalTimeWeightedAveragePositionRequirement)
	    writer.bytes(9, obj.notionalTimeWeightedAveragePositionRequirement, string$X);
	  if (obj.windowLength) writer.varint(10, obj.windowLength, uint64$f);
	  if (obj.lockPeriod) writer.varint(11, obj.lockPeriod, uint64$f);
	  if (obj.distributionStrategy)
	    writer.varint(12, obj.distributionStrategy, _vega_DistributionStrategy);
	  if (obj.rankTable?.length)
	    obj.rankTable.forEach((v) => writer.bytes(13, _vega_Rank.encode(v)));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1i = writer;
	const { uint64: uint64$e } = types$1;
	const _vega_DispatchStrategy$1 = encode$1r;

	encode$1s.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1i();

	  if (obj.startEpoch) writer.varint(1, obj.startEpoch, uint64$e);
	  if (obj.endEpoch) writer.varint(2, obj.endEpoch, uint64$e);
	  if (obj.dispatchStrategy)
	    writer.bytes(3, _vega_DispatchStrategy$1.encode(obj.dispatchStrategy));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1h = writer;
	const { string: string$W } = types$1;
	const _vega_AccountType$1 = AccountType;
	const _vega_GovernanceTransferType = GovernanceTransferType;
	const _vega_OneOffTransfer = encode$1t;
	const _vega_RecurringTransfer = encode$1s;

	encode$1w.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1h();

	  if (obj.sourceType) writer.varint(1, obj.sourceType, _vega_AccountType$1);
	  if (obj.source) writer.bytes(2, obj.source, string$W);
	  if (obj.transferType)
	    writer.varint(3, obj.transferType, _vega_GovernanceTransferType);
	  if (obj.amount) writer.bytes(4, obj.amount, string$W);
	  if (obj.asset) writer.bytes(5, obj.asset, string$W);
	  if (obj.fractionOfBalance) writer.bytes(6, obj.fractionOfBalance, string$W);
	  if (obj.destinationType)
	    writer.varint(7, obj.destinationType, _vega_AccountType$1);
	  if (obj.destination) writer.bytes(8, obj.destination, string$W);

	  if (obj.kind?.oneOff ?? obj.oneOff)
	    writer.bytes(
	      101,
	      _vega_OneOffTransfer.encode(obj.kind?.oneOff ?? obj.oneOff)
	    );
	  if (obj.kind?.recurring ?? obj.recurring)
	    writer.bytes(
	      102,
	      _vega_RecurringTransfer.encode(obj.kind?.recurring ?? obj.recurring)
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1g = writer;

	const _vega_NewTransferConfiguration = encode$1w;

	encode$1x.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1g();

	  if (obj.changes)
	    writer.bytes(1, _vega_NewTransferConfiguration.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1l = {};

	var encode$1k = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1f = writer;
	const { string: string$V } = types$1;

	encode$1k.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1f();

	  if (obj.transferId) writer.bytes(1, obj.transferId, string$V);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1e = writer;

	const _vega_CancelTransferConfiguration = encode$1k;

	encode$1l.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1e();

	  if (obj.changes)
	    writer.bytes(1, _vega_CancelTransferConfiguration.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1j = {};

	var encode$1i = {};

	/// autogenerated by protoc-plugin-js
	const assert$9 = nanoassert;
	const { enumerable: enumerable$9 } = types$1;
	const { enumerable: decodeEnumerable$9 } = types;

	const MARKET_STATE_UPDATE_TYPE_UNSPECIFIED = 0;
	const MARKET_STATE_UPDATE_TYPE_TERMINATE = 1;
	const MARKET_STATE_UPDATE_TYPE_SUSPEND = 2;
	const MARKET_STATE_UPDATE_TYPE_RESUME = 3;

	const enumValues$9 = new Map([
	  [0, 'MARKET_STATE_UPDATE_TYPE_UNSPECIFIED'],
	  [1, 'MARKET_STATE_UPDATE_TYPE_TERMINATE'],
	  [2, 'MARKET_STATE_UPDATE_TYPE_SUSPEND'],
	  [3, 'MARKET_STATE_UPDATE_TYPE_RESUME']
	]);
	const enumNames$9 = new Map([
	  ['MARKET_STATE_UPDATE_TYPE_UNSPECIFIED', 0],
	  ['MARKET_STATE_UPDATE_TYPE_TERMINATE', 1],
	  ['MARKET_STATE_UPDATE_TYPE_SUSPEND', 2],
	  ['MARKET_STATE_UPDATE_TYPE_RESUME', 3]
	]);

	function encode$1h(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$1h(parse$9(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid MarketStateUpdateType value (' + value + ')')

	  return enumerable$9.encode(value, buf, byteOffset)
	}

	function decode$9(varint) {
	  const int = decodeEnumerable$9(varint);

	  return stringify$9(int) ?? int
	}

	function encodingLength$9(value) {
	  if (typeof value === 'string') return encodingLength$9(parse$9(value))
	  assert$9(value != null, 'Invalid MarketStateUpdateType value (' + value + ')');

	  if (0 <= value && value <= 3) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$9(int) {
	  return enumValues$9.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$9(str) {
	  return enumNames$9.get(str)
	}

	var MarketStateUpdateType = {
	  encode: encode$1h,
	  decode: decode$9,
	  encodingLength: encodingLength$9,
	  stringify: stringify$9,
	  parse: parse$9,
	  MARKET_STATE_UPDATE_TYPE_UNSPECIFIED,
	  MARKET_STATE_UPDATE_TYPE_TERMINATE,
	  MARKET_STATE_UPDATE_TYPE_SUSPEND,
	  MARKET_STATE_UPDATE_TYPE_RESUME
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1d = writer;
	const { string: string$U } = types$1;
	const _vega_MarketStateUpdateType = MarketStateUpdateType;

	encode$1i.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1d();

	  if (obj.marketId) writer.bytes(1, obj.marketId, string$U);
	  if (obj.updateType)
	    writer.varint(2, obj.updateType, _vega_MarketStateUpdateType);
	  if (obj.price) writer.bytes(3, obj.price, string$U);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$1c = writer;

	const _vega_UpdateMarketStateConfiguration = encode$1i;

	encode$1j.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1c();

	  if (obj.changes)
	    writer.bytes(1, _vega_UpdateMarketStateConfiguration.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1g = {};

	var encode$1f = {};

	var encode$1e = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1b = writer;
	const { string: string$T } = types$1;

	encode$1e.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1b();

	  if (obj.minimumRunningNotionalTakerVolume)
	    writer.bytes(1, obj.minimumRunningNotionalTakerVolume, string$T);
	  if (obj.minimumEpochs) writer.bytes(2, obj.minimumEpochs, string$T);
	  if (obj.referralRewardFactor)
	    writer.bytes(3, obj.referralRewardFactor, string$T);
	  if (obj.referralDiscountFactor)
	    writer.bytes(4, obj.referralDiscountFactor, string$T);

	  return writer.concat(buf, byteOffset)
	};

	var encode$1d = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1a = writer;
	const { string: string$S } = types$1;

	encode$1d.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1a();

	  if (obj.minimumStakedTokens) writer.bytes(1, obj.minimumStakedTokens, string$S);
	  if (obj.referralRewardMultiplier)
	    writer.bytes(2, obj.referralRewardMultiplier, string$S);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$19 = writer;
	const { int64: int64$b, uint64: uint64$d } = types$1;
	const _vega_BenefitTier = encode$1e;
	const _vega_StakingTier = encode$1d;

	encode$1f.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$19();

	  if (obj.benefitTiers?.length)
	    obj.benefitTiers.forEach((v) =>
	      writer.bytes(1, _vega_BenefitTier.encode(v))
	    );
	  if (obj.endOfProgramTimestamp)
	    writer.varint(2, obj.endOfProgramTimestamp, int64$b);
	  if (obj.windowLength) writer.varint(3, obj.windowLength, uint64$d);
	  if (obj.stakingTiers?.length)
	    obj.stakingTiers.forEach((v) =>
	      writer.bytes(4, _vega_StakingTier.encode(v))
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$18 = writer;

	const _vega_ReferralProgramChanges = encode$1f;

	encode$1g.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$18();

	  if (obj.changes)
	    writer.bytes(1, _vega_ReferralProgramChanges.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	var encode$1c = {};

	var encode$1b = {};

	var encode$1a = {};

	/// autogenerated by protoc-plugin-js
	const Writer$17 = writer;
	const { string: string$R } = types$1;

	encode$1a.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$17();

	  if (obj.minimumRunningNotionalTakerVolume)
	    writer.bytes(1, obj.minimumRunningNotionalTakerVolume, string$R);
	  if (obj.volumeDiscountFactor)
	    writer.bytes(2, obj.volumeDiscountFactor, string$R);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$16 = writer;
	const { int64: int64$a, uint64: uint64$c } = types$1;
	const _vega_VolumeBenefitTier = encode$1a;

	encode$1b.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$16();

	  if (obj.benefitTiers?.length)
	    obj.benefitTiers.forEach((v) =>
	      writer.bytes(1, _vega_VolumeBenefitTier.encode(v))
	    );
	  if (obj.endOfProgramTimestamp)
	    writer.varint(2, obj.endOfProgramTimestamp, int64$a);
	  if (obj.windowLength) writer.varint(3, obj.windowLength, uint64$c);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$15 = writer;

	const _vega_VolumeDiscountProgramChanges = encode$1b;

	encode$1c.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$15();

	  if (obj.changes)
	    writer.bytes(1, _vega_VolumeDiscountProgramChanges.encode(obj.changes));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$14 = writer;
	const { int64: int64$9 } = types$1;
	const _vega_UpdateMarket$1 = encode$2z;
	const _vega_NewMarket$1 = encode$1S;
	const _vega_UpdateNetworkParameter$1 = encode$1L;
	const _vega_NewAsset = encode$1J;
	const _vega_NewFreeform$1 = encode$1F;
	const _vega_UpdateAsset$1 = encode$1E;
	const _vega_NewSpotMarket$1 = encode$1B;
	const _vega_UpdateSpotMarket$1 = encode$1z;
	const _vega_NewTransfer$1 = encode$1x;
	const _vega_CancelTransfer$1 = encode$1l;
	const _vega_UpdateMarketState$1 = encode$1j;
	const _vega_UpdateReferralProgram$1 = encode$1g;
	const _vega_UpdateVolumeDiscountProgram$1 = encode$1c;

	encode$2A.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$14();

	  if (obj.closingTimestamp) writer.varint(1, obj.closingTimestamp, int64$9);
	  if (obj.enactmentTimestamp) writer.varint(2, obj.enactmentTimestamp, int64$9);
	  if (obj.validationTimestamp) writer.varint(3, obj.validationTimestamp, int64$9);

	  if (obj.change?.updateMarket ?? obj.updateMarket)
	    writer.bytes(
	      101,
	      _vega_UpdateMarket$1.encode(obj.change?.updateMarket ?? obj.updateMarket)
	    );
	  if (obj.change?.newMarket ?? obj.newMarket)
	    writer.bytes(
	      102,
	      _vega_NewMarket$1.encode(obj.change?.newMarket ?? obj.newMarket)
	    );
	  if (obj.change?.updateNetworkParameter ?? obj.updateNetworkParameter)
	    writer.bytes(
	      103,
	      _vega_UpdateNetworkParameter$1.encode(
	        obj.change?.updateNetworkParameter ?? obj.updateNetworkParameter
	      )
	    );
	  if (obj.change?.newAsset ?? obj.newAsset)
	    writer.bytes(
	      104,
	      _vega_NewAsset.encode(obj.change?.newAsset ?? obj.newAsset)
	    );
	  if (obj.change?.newFreeform ?? obj.newFreeform)
	    writer.bytes(
	      105,
	      _vega_NewFreeform$1.encode(obj.change?.newFreeform ?? obj.newFreeform)
	    );
	  if (obj.change?.updateAsset ?? obj.updateAsset)
	    writer.bytes(
	      106,
	      _vega_UpdateAsset$1.encode(obj.change?.updateAsset ?? obj.updateAsset)
	    );
	  if (obj.change?.newSpotMarket ?? obj.newSpotMarket)
	    writer.bytes(
	      107,
	      _vega_NewSpotMarket$1.encode(obj.change?.newSpotMarket ?? obj.newSpotMarket)
	    );
	  if (obj.change?.updateSpotMarket ?? obj.updateSpotMarket)
	    writer.bytes(
	      108,
	      _vega_UpdateSpotMarket$1.encode(
	        obj.change?.updateSpotMarket ?? obj.updateSpotMarket
	      )
	    );
	  if (obj.change?.newTransfer ?? obj.newTransfer)
	    writer.bytes(
	      109,
	      _vega_NewTransfer$1.encode(obj.change?.newTransfer ?? obj.newTransfer)
	    );
	  if (obj.change?.cancelTransfer ?? obj.cancelTransfer)
	    writer.bytes(
	      110,
	      _vega_CancelTransfer$1.encode(
	        obj.change?.cancelTransfer ?? obj.cancelTransfer
	      )
	    );
	  if (obj.change?.updateMarketState ?? obj.updateMarketState)
	    writer.bytes(
	      111,
	      _vega_UpdateMarketState$1.encode(
	        obj.change?.updateMarketState ?? obj.updateMarketState
	      )
	    );
	  if (obj.change?.updateReferralProgram ?? obj.updateReferralProgram)
	    writer.bytes(
	      112,
	      _vega_UpdateReferralProgram$1.encode(
	        obj.change?.updateReferralProgram ?? obj.updateReferralProgram
	      )
	    );
	  if (
	    obj.change?.updateVolumeDiscountProgram ??
	    obj.updateVolumeDiscountProgram
	  )
	    writer.bytes(
	      113,
	      _vega_UpdateVolumeDiscountProgram$1.encode(
	        obj.change?.updateVolumeDiscountProgram ??
	          obj.updateVolumeDiscountProgram
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$19 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$13 = writer;
	const { string: string$Q } = types$1;

	encode$19.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$13();

	  if (obj.description) writer.bytes(1, obj.description, string$Q);
	  if (obj.title) writer.bytes(4, obj.title, string$Q);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$12 = writer;
	const { string: string$P } = types$1;
	const _vega_ProposalTerms = encode$2A;
	const _vega_ProposalRationale$1 = encode$19;

	encode$2B.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$12();

	  if (obj.reference) writer.bytes(1, obj.reference, string$P);
	  if (obj.terms) writer.bytes(2, _vega_ProposalTerms.encode(obj.terms));
	  if (obj.rationale)
	    writer.bytes(3, _vega_ProposalRationale$1.encode(obj.rationale));

	  return writer.concat(buf, byteOffset)
	};

	var encode$18 = {};

	/// autogenerated by protoc-plugin-js
	const assert$8 = nanoassert;
	const { enumerable: enumerable$8 } = types$1;
	const { enumerable: decodeEnumerable$8 } = types;

	const VALUE_UNSPECIFIED = 0;
	const VALUE_NO = 1;
	const VALUE_YES = 2;

	const enumValues$8 = new Map([
	  [0, 'VALUE_UNSPECIFIED'],
	  [1, 'VALUE_NO'],
	  [2, 'VALUE_YES']
	]);
	const enumNames$8 = new Map([
	  ['VALUE_UNSPECIFIED', 0],
	  ['VALUE_NO', 1],
	  ['VALUE_YES', 2]
	]);

	function encode$17(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$17(parse$8(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid Value value (' + value + ')')

	  return enumerable$8.encode(value, buf, byteOffset)
	}

	function decode$8(varint) {
	  const int = decodeEnumerable$8(varint);

	  return stringify$8(int) ?? int
	}

	function encodingLength$8(value) {
	  if (typeof value === 'string') return encodingLength$8(parse$8(value))
	  assert$8(value != null, 'Invalid Value value (' + value + ')');

	  if (0 <= value && value <= 2) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$8(int) {
	  return enumValues$8.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$8(str) {
	  return enumNames$8.get(str)
	}

	var Value = {
	  encode: encode$17,
	  decode: decode$8,
	  encodingLength: encodingLength$8,
	  stringify: stringify$8,
	  parse: parse$8,
	  VALUE_UNSPECIFIED,
	  VALUE_NO,
	  VALUE_YES
	};

	/// autogenerated by protoc-plugin-js
	const Writer$11 = writer;
	const { string: string$O } = types$1;
	const _vega_Vote_Value = Value;

	encode$18.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$11();

	  if (obj.proposalId) writer.bytes(1, obj.proposalId, string$O);
	  if (obj.value) writer.varint(2, obj.value, _vega_Vote_Value);

	  return writer.concat(buf, byteOffset)
	};

	var encode$16 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$10 = writer;
	const { string: string$N } = types$1;

	encode$16.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$10();

	  if (obj.marketId) writer.bytes(1, obj.marketId, string$N);
	  if (obj.commitmentAmount) writer.bytes(2, obj.commitmentAmount, string$N);
	  if (obj.fee) writer.bytes(3, obj.fee, string$N);
	  if (obj.reference) writer.bytes(6, obj.reference, string$N);

	  return writer.concat(buf, byteOffset)
	};

	var encode$15 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$$ = writer;
	const { string: string$M } = types$1;

	encode$15.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$$();

	  if (obj.nodeId) writer.bytes(1, obj.nodeId, string$M);
	  if (obj.amount) writer.bytes(2, obj.amount, string$M);

	  return writer.concat(buf, byteOffset)
	};

	var encode$14 = {};

	/// autogenerated by protoc-plugin-js
	const assert$7 = nanoassert;
	const { enumerable: enumerable$7 } = types$1;
	const { enumerable: decodeEnumerable$7 } = types;

	const METHOD_UNSPECIFIED = 0;
	const METHOD_NOW = 1;
	const METHOD_AT_END_OF_EPOCH = 2;

	const enumValues$7 = new Map([
	  [0, 'METHOD_UNSPECIFIED'],
	  [1, 'METHOD_NOW'],
	  [2, 'METHOD_AT_END_OF_EPOCH']
	]);
	const enumNames$7 = new Map([
	  ['METHOD_UNSPECIFIED', 0],
	  ['METHOD_NOW', 1],
	  ['METHOD_AT_END_OF_EPOCH', 2]
	]);

	function encode$13(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$13(parse$7(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid Method value (' + value + ')')

	  return enumerable$7.encode(value, buf, byteOffset)
	}

	function decode$7(varint) {
	  const int = decodeEnumerable$7(varint);

	  return stringify$7(int) ?? int
	}

	function encodingLength$7(value) {
	  if (typeof value === 'string') return encodingLength$7(parse$7(value))
	  assert$7(value != null, 'Invalid Method value (' + value + ')');

	  if (0 <= value && value <= 2) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$7(int) {
	  return enumValues$7.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$7(str) {
	  return enumNames$7.get(str)
	}

	var Method = {
	  encode: encode$13,
	  decode: decode$7,
	  encodingLength: encodingLength$7,
	  stringify: stringify$7,
	  parse: parse$7,
	  METHOD_UNSPECIFIED,
	  METHOD_NOW,
	  METHOD_AT_END_OF_EPOCH
	};

	/// autogenerated by protoc-plugin-js
	const Writer$_ = writer;
	const { string: string$L } = types$1;
	const _vega_commands_v1_UndelegateSubmission_Method = Method;

	encode$14.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$_();

	  if (obj.nodeId) writer.bytes(1, obj.nodeId, string$L);
	  if (obj.amount) writer.bytes(2, obj.amount, string$L);
	  if (obj.method)
	    writer.varint(3, obj.method, _vega_commands_v1_UndelegateSubmission_Method);

	  return writer.concat(buf, byteOffset)
	};

	var encode$12 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$Z = writer;
	const { string: string$K } = types$1;

	encode$12.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$Z();

	  if (obj.marketId) writer.bytes(1, obj.marketId, string$K);

	  return writer.concat(buf, byteOffset)
	};

	var encode$11 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$Y = writer;
	const { string: string$J } = types$1;

	encode$11.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$Y();

	  if (obj.marketId) writer.bytes(1, obj.marketId, string$J);
	  if (obj.commitmentAmount) writer.bytes(2, obj.commitmentAmount, string$J);
	  if (obj.fee) writer.bytes(3, obj.fee, string$J);
	  if (obj.reference) writer.bytes(6, obj.reference, string$J);

	  return writer.concat(buf, byteOffset)
	};

	var encode$10 = {};

	var encode$$ = {};

	/// autogenerated by protoc-plugin-js
	const Writer$X = writer;
	const { int64: int64$8 } = types$1;

	encode$$.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$X();

	  if (obj.deliverOn) writer.varint(1, obj.deliverOn, int64$8);

	  return writer.concat(buf, byteOffset)
	};

	var encode$_ = {};

	/// autogenerated by protoc-plugin-js
	const Writer$W = writer;
	const { uint64: uint64$b, string: string$I } = types$1;
	const _vega_DispatchStrategy = encode$1r;

	encode$_.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$W();

	  if (obj.startEpoch) writer.varint(1, obj.startEpoch, uint64$b);
	  if (obj.endEpoch) writer.varint(2, obj.endEpoch, uint64$b);
	  if (obj.factor) writer.bytes(3, obj.factor, string$I);
	  if (obj.dispatchStrategy)
	    writer.bytes(4, _vega_DispatchStrategy.encode(obj.dispatchStrategy));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$V = writer;
	const { string: string$H } = types$1;
	const _vega_AccountType = AccountType;
	const _vega_commands_v1_OneOffTransfer = encode$$;
	const _vega_commands_v1_RecurringTransfer = encode$_;

	encode$10.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$V();

	  if (obj.fromAccountType)
	    writer.varint(1, obj.fromAccountType, _vega_AccountType);
	  if (obj.to) writer.bytes(2, obj.to, string$H);
	  if (obj.toAccountType) writer.varint(3, obj.toAccountType, _vega_AccountType);
	  if (obj.asset) writer.bytes(4, obj.asset, string$H);
	  if (obj.amount) writer.bytes(5, obj.amount, string$H);
	  if (obj.reference) writer.bytes(6, obj.reference, string$H);

	  if (obj.kind?.oneOff ?? obj.oneOff)
	    writer.bytes(
	      101,
	      _vega_commands_v1_OneOffTransfer.encode(obj.kind?.oneOff ?? obj.oneOff)
	    );
	  if (obj.kind?.recurring ?? obj.recurring)
	    writer.bytes(
	      102,
	      _vega_commands_v1_RecurringTransfer.encode(
	        obj.kind?.recurring ?? obj.recurring
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$Z = {};

	/// autogenerated by protoc-plugin-js
	const Writer$U = writer;
	const { string: string$G } = types$1;

	encode$Z.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$U();

	  if (obj.transferId) writer.bytes(1, obj.transferId, string$G);

	  return writer.concat(buf, byteOffset)
	};

	var encode$Y = {};

	var encode$X = {};

	/// autogenerated by protoc-plugin-js
	const Writer$T = writer;
	const { string: string$F, uint32: uint32$3 } = types$1;

	encode$X.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$T();

	  if (obj.value) writer.bytes(1, obj.value, string$F);
	  if (obj.algo) writer.bytes(2, obj.algo, string$F);
	  if (obj.version) writer.varint(3, obj.version, uint32$3);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$S = writer;
	const { string: string$E, uint32: uint32$2, uint64: uint64$a } = types$1;
	const _vega_commands_v1_Signature$3 = encode$X;

	encode$Y.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$S();

	  if (obj.vegaPubKey) writer.bytes(1, obj.vegaPubKey, string$E);
	  if (obj.ethereumAddress) writer.bytes(2, obj.ethereumAddress, string$E);
	  if (obj.chainPubKey) writer.bytes(3, obj.chainPubKey, string$E);
	  if (obj.infoUrl) writer.bytes(4, obj.infoUrl, string$E);
	  if (obj.country) writer.bytes(5, obj.country, string$E);
	  if (obj.id) writer.bytes(6, obj.id, string$E);
	  if (obj.name) writer.bytes(7, obj.name, string$E);
	  if (obj.avatarUrl) writer.bytes(8, obj.avatarUrl, string$E);
	  if (obj.vegaPubKeyIndex) writer.varint(9, obj.vegaPubKeyIndex, uint32$2);
	  if (obj.fromEpoch) writer.varint(10, obj.fromEpoch, uint64$a);
	  if (obj.ethereumSignature)
	    writer.bytes(11, _vega_commands_v1_Signature$3.encode(obj.ethereumSignature));
	  if (obj.vegaSignature)
	    writer.bytes(12, _vega_commands_v1_Signature$3.encode(obj.vegaSignature));
	  if (obj.submitterAddress) writer.bytes(13, obj.submitterAddress, string$E);

	  return writer.concat(buf, byteOffset)
	};

	var encode$W = {};

	var encode$V = {};

	/// autogenerated by protoc-plugin-js
	const Writer$R = writer;
	const { string: string$D } = types$1;

	encode$V.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$R();

	  if (obj.marketId) writer.bytes(1, obj.marketId, string$D);
	  if (obj.stopOrderId) writer.bytes(2, obj.stopOrderId, string$D);

	  return writer.concat(buf, byteOffset)
	};

	var encode$U = {};

	var encode$T = {};

	/// autogenerated by protoc-plugin-js
	const assert$6 = nanoassert;
	const { enumerable: enumerable$6 } = types$1;
	const { enumerable: decodeEnumerable$6 } = types;

	const EXPIRY_STRATEGY_UNSPECIFIED = 0;
	const EXPIRY_STRATEGY_CANCELS = 1;
	const EXPIRY_STRATEGY_SUBMIT = 2;

	const enumValues$6 = new Map([
	  [0, 'EXPIRY_STRATEGY_UNSPECIFIED'],
	  [1, 'EXPIRY_STRATEGY_CANCELS'],
	  [2, 'EXPIRY_STRATEGY_SUBMIT']
	]);
	const enumNames$6 = new Map([
	  ['EXPIRY_STRATEGY_UNSPECIFIED', 0],
	  ['EXPIRY_STRATEGY_CANCELS', 1],
	  ['EXPIRY_STRATEGY_SUBMIT', 2]
	]);

	function encode$S(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$S(parse$6(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid ExpiryStrategy value (' + value + ')')

	  return enumerable$6.encode(value, buf, byteOffset)
	}

	function decode$6(varint) {
	  const int = decodeEnumerable$6(varint);

	  return stringify$6(int) ?? int
	}

	function encodingLength$6(value) {
	  if (typeof value === 'string') return encodingLength$6(parse$6(value))
	  assert$6(value != null, 'Invalid ExpiryStrategy value (' + value + ')');

	  if (0 <= value && value <= 2) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$6(int) {
	  return enumValues$6.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$6(str) {
	  return enumNames$6.get(str)
	}

	var ExpiryStrategy = {
	  encode: encode$S,
	  decode: decode$6,
	  encodingLength: encodingLength$6,
	  stringify: stringify$6,
	  parse: parse$6,
	  EXPIRY_STRATEGY_UNSPECIFIED,
	  EXPIRY_STRATEGY_CANCELS,
	  EXPIRY_STRATEGY_SUBMIT
	};

	/// autogenerated by protoc-plugin-js
	const assert$5 = nanoassert;
	const { enumerable: enumerable$5 } = types$1;
	const { enumerable: decodeEnumerable$5 } = types;

	const SIZE_OVERRIDE_SETTING_UNSPECIFIED = 0;
	const SIZE_OVERRIDE_SETTING_NONE = 1;
	const SIZE_OVERRIDE_SETTING_POSITION = 2;

	const enumValues$5 = new Map([
	  [0, 'SIZE_OVERRIDE_SETTING_UNSPECIFIED'],
	  [1, 'SIZE_OVERRIDE_SETTING_NONE'],
	  [2, 'SIZE_OVERRIDE_SETTING_POSITION']
	]);
	const enumNames$5 = new Map([
	  ['SIZE_OVERRIDE_SETTING_UNSPECIFIED', 0],
	  ['SIZE_OVERRIDE_SETTING_NONE', 1],
	  ['SIZE_OVERRIDE_SETTING_POSITION', 2]
	]);

	function encode$R(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$R(parse$5(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid SizeOverrideSetting value (' + value + ')')

	  return enumerable$5.encode(value, buf, byteOffset)
	}

	function decode$5(varint) {
	  const int = decodeEnumerable$5(varint);

	  return stringify$5(int) ?? int
	}

	function encodingLength$5(value) {
	  if (typeof value === 'string') return encodingLength$5(parse$5(value))
	  assert$5(value != null, 'Invalid SizeOverrideSetting value (' + value + ')');

	  if (0 <= value && value <= 2) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$5(int) {
	  return enumValues$5.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$5(str) {
	  return enumNames$5.get(str)
	}

	var SizeOverrideSetting = {
	  encode: encode$R,
	  decode: decode$5,
	  encodingLength: encodingLength$5,
	  stringify: stringify$5,
	  parse: parse$5,
	  SIZE_OVERRIDE_SETTING_UNSPECIFIED,
	  SIZE_OVERRIDE_SETTING_NONE,
	  SIZE_OVERRIDE_SETTING_POSITION
	};

	var encode$Q = {};

	/// autogenerated by protoc-plugin-js
	const Writer$Q = writer;
	const { string: string$C } = types$1;

	encode$Q.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$Q();

	  if (obj.percentage) writer.bytes(1, obj.percentage, string$C);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$P = writer;
	const { int64: int64$7, string: string$B } = types$1;
	const _vega_commands_v1_OrderSubmission$2 = encode$2N;
	const _vega_StopOrder_ExpiryStrategy = ExpiryStrategy;
	const _vega_StopOrder_SizeOverrideSetting = SizeOverrideSetting;
	const _vega_StopOrder_SizeOverrideValue = encode$Q;

	encode$T.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$P();

	  if (obj.orderSubmission)
	    writer.bytes(
	      1,
	      _vega_commands_v1_OrderSubmission$2.encode(obj.orderSubmission)
	    );
	  if (obj.expiresAt) writer.varint(2, obj.expiresAt, int64$7);
	  if (obj.expiryStrategy)
	    writer.varint(3, obj.expiryStrategy, _vega_StopOrder_ExpiryStrategy);
	  if (obj.sizeOverrideSetting)
	    writer.varint(
	      4,
	      obj.sizeOverrideSetting,
	      _vega_StopOrder_SizeOverrideSetting
	    );
	  if (obj.sizeOverrideValue)
	    writer.bytes(
	      5,
	      _vega_StopOrder_SizeOverrideValue.encode(obj.sizeOverrideValue)
	    );

	  if (obj.trigger?.price ?? obj.price)
	    writer.bytes(100, obj.trigger?.price ?? obj.price, string$B);
	  if (obj.trigger?.trailingPercentOffset ?? obj.trailingPercentOffset)
	    writer.bytes(
	      101,
	      obj.trigger?.trailingPercentOffset ?? obj.trailingPercentOffset,
	      string$B
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$O = writer;

	const _vega_commands_v1_StopOrderSetup = encode$T;

	encode$U.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$O();

	  if (obj.risesAbove)
	    writer.bytes(1, _vega_commands_v1_StopOrderSetup.encode(obj.risesAbove));
	  if (obj.fallsBelow)
	    writer.bytes(2, _vega_commands_v1_StopOrderSetup.encode(obj.fallsBelow));

	  return writer.concat(buf, byteOffset)
	};

	var encode$P = {};

	/// autogenerated by protoc-plugin-js
	const assert$4 = nanoassert;
	const { enumerable: enumerable$4 } = types$1;
	const { enumerable: decodeEnumerable$4 } = types;

	const MODE_UNSPECIFIED = 0;
	const MODE_CROSS_MARGIN = 1;
	const MODE_ISOLATED_MARGIN = 2;

	const enumValues$4 = new Map([
	  [0, 'MODE_UNSPECIFIED'],
	  [1, 'MODE_CROSS_MARGIN'],
	  [2, 'MODE_ISOLATED_MARGIN']
	]);
	const enumNames$4 = new Map([
	  ['MODE_UNSPECIFIED', 0],
	  ['MODE_CROSS_MARGIN', 1],
	  ['MODE_ISOLATED_MARGIN', 2]
	]);

	function encode$O(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$O(parse$4(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid Mode value (' + value + ')')

	  return enumerable$4.encode(value, buf, byteOffset)
	}

	function decode$4(varint) {
	  const int = decodeEnumerable$4(varint);

	  return stringify$4(int) ?? int
	}

	function encodingLength$4(value) {
	  if (typeof value === 'string') return encodingLength$4(parse$4(value))
	  assert$4(value != null, 'Invalid Mode value (' + value + ')');

	  if (0 <= value && value <= 2) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$4(int) {
	  return enumValues$4.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$4(str) {
	  return enumNames$4.get(str)
	}

	var Mode = {
	  encode: encode$O,
	  decode: decode$4,
	  encodingLength: encodingLength$4,
	  stringify: stringify$4,
	  parse: parse$4,
	  MODE_UNSPECIFIED,
	  MODE_CROSS_MARGIN,
	  MODE_ISOLATED_MARGIN
	};

	/// autogenerated by protoc-plugin-js
	const Writer$N = writer;
	const { string: string$A } = types$1;
	const _vega_commands_v1_UpdateMarginMode_Mode = Mode;

	encode$P.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$N();

	  if (obj.marketId) writer.bytes(1, obj.marketId, string$A);
	  if (obj.mode)
	    writer.varint(2, obj.mode, _vega_commands_v1_UpdateMarginMode_Mode);
	  if (obj.marginFactor) writer.bytes(3, obj.marginFactor, string$A);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$M = writer;

	const _vega_commands_v1_OrderCancellation$1 = encode$2G;
	const _vega_commands_v1_OrderAmendment$1 = encode$2F;
	const _vega_commands_v1_OrderSubmission$1 = encode$2N;
	const _vega_commands_v1_StopOrdersCancellation$1 = encode$V;
	const _vega_commands_v1_StopOrdersSubmission$1 = encode$U;
	const _vega_commands_v1_UpdateMarginMode$1 = encode$P;

	encode$W.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$M();

	  if (obj.cancellations?.length)
	    obj.cancellations.forEach((v) =>
	      writer.bytes(1, _vega_commands_v1_OrderCancellation$1.encode(v))
	    );
	  if (obj.amendments?.length)
	    obj.amendments.forEach((v) =>
	      writer.bytes(2, _vega_commands_v1_OrderAmendment$1.encode(v))
	    );
	  if (obj.submissions?.length)
	    obj.submissions.forEach((v) =>
	      writer.bytes(3, _vega_commands_v1_OrderSubmission$1.encode(v))
	    );
	  if (obj.stopOrdersCancellation?.length)
	    obj.stopOrdersCancellation.forEach((v) =>
	      writer.bytes(4, _vega_commands_v1_StopOrdersCancellation$1.encode(v))
	    );
	  if (obj.stopOrdersSubmission?.length)
	    obj.stopOrdersSubmission.forEach((v) =>
	      writer.bytes(5, _vega_commands_v1_StopOrdersSubmission$1.encode(v))
	    );
	  if (obj.updateMarginMode?.length)
	    obj.updateMarginMode.forEach((v) =>
	      writer.bytes(6, _vega_commands_v1_UpdateMarginMode$1.encode(v))
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$N = {};

	var encode$M = {};

	/// autogenerated by protoc-plugin-js
	const Writer$L = writer;
	const { string: string$z, bool: bool$4 } = types$1;

	encode$M.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$L();

	  if (obj.name) writer.bytes(10, obj.name, string$z);
	  if (obj.teamUrl) writer.bytes(11, obj.teamUrl, string$z);
	  if (obj.avatarUrl) writer.bytes(12, obj.avatarUrl, string$z);
	  if (obj.closed) writer.varint(13, obj.closed, bool$4);
	  if (obj.allowList?.length)
	    obj.allowList.forEach((v) => writer.bytes(14, v, string$z));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$K = writer;
	const { bool: bool$3 } = types$1;
	const _vega_commands_v1_CreateReferralSet_Team = encode$M;

	encode$N.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$K();

	  if (obj.isTeam) writer.varint(1, obj.isTeam, bool$3);
	  if (obj.team)
	    writer.bytes(2, _vega_commands_v1_CreateReferralSet_Team.encode(obj.team));

	  return writer.concat(buf, byteOffset)
	};

	var encode$L = {};

	var encode$K = {};

	/// autogenerated by protoc-plugin-js
	const Writer$J = writer;
	const { string: string$y, bool: bool$2 } = types$1;

	encode$K.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$J();

	  if (obj.name) writer.bytes(10, obj.name, string$y);
	  if (obj.teamUrl) writer.bytes(11, obj.teamUrl, string$y);
	  if (obj.avatarUrl) writer.bytes(12, obj.avatarUrl, string$y);
	  if (obj.closed) writer.varint(13, obj.closed, bool$2);
	  if (obj.allowList?.length)
	    obj.allowList.forEach((v) => writer.bytes(14, v, string$y));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$I = writer;
	const { string: string$x, bool: bool$1 } = types$1;
	const _vega_commands_v1_UpdateReferralSet_Team = encode$K;

	encode$L.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$I();

	  if (obj.id) writer.bytes(1, obj.id, string$x);
	  if (obj.isTeam) writer.varint(2, obj.isTeam, bool$1);
	  if (obj.team)
	    writer.bytes(3, _vega_commands_v1_UpdateReferralSet_Team.encode(obj.team));

	  return writer.concat(buf, byteOffset)
	};

	var encode$J = {};

	/// autogenerated by protoc-plugin-js
	const Writer$H = writer;
	const { string: string$w } = types$1;

	encode$J.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$H();

	  if (obj.id) writer.bytes(1, obj.id, string$w);

	  return writer.concat(buf, byteOffset)
	};

	var encode$I = {};

	/// autogenerated by protoc-plugin-js
	const Writer$G = writer;
	const { string: string$v } = types$1;

	encode$I.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$G();

	  if (obj.id) writer.bytes(1, obj.id, string$v);

	  return writer.concat(buf, byteOffset)
	};

	var encode$H = {};

	var encode$G = {};

	var encode$F = {};

	/// autogenerated by protoc-plugin-js
	const Writer$F = writer;
	const { int64: int64$6 } = types$1;
	const _vega_UpdateMarket = encode$2z;
	const _vega_NewMarket = encode$1S;
	const _vega_UpdateNetworkParameter = encode$1L;
	const _vega_NewFreeform = encode$1F;
	const _vega_UpdateAsset = encode$1E;
	const _vega_NewSpotMarket = encode$1B;
	const _vega_UpdateSpotMarket = encode$1z;
	const _vega_NewTransfer = encode$1x;
	const _vega_CancelTransfer = encode$1l;
	const _vega_UpdateMarketState = encode$1j;
	const _vega_UpdateReferralProgram = encode$1g;
	const _vega_UpdateVolumeDiscountProgram = encode$1c;

	encode$F.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$F();

	  if (obj.enactmentTimestamp) writer.varint(1, obj.enactmentTimestamp, int64$6);

	  if (obj.change?.updateMarket ?? obj.updateMarket)
	    writer.bytes(
	      101,
	      _vega_UpdateMarket.encode(obj.change?.updateMarket ?? obj.updateMarket)
	    );
	  if (obj.change?.newMarket ?? obj.newMarket)
	    writer.bytes(
	      102,
	      _vega_NewMarket.encode(obj.change?.newMarket ?? obj.newMarket)
	    );
	  if (obj.change?.updateNetworkParameter ?? obj.updateNetworkParameter)
	    writer.bytes(
	      103,
	      _vega_UpdateNetworkParameter.encode(
	        obj.change?.updateNetworkParameter ?? obj.updateNetworkParameter
	      )
	    );
	  if (obj.change?.newFreeform ?? obj.newFreeform)
	    writer.bytes(
	      104,
	      _vega_NewFreeform.encode(obj.change?.newFreeform ?? obj.newFreeform)
	    );
	  if (obj.change?.updateAsset ?? obj.updateAsset)
	    writer.bytes(
	      105,
	      _vega_UpdateAsset.encode(obj.change?.updateAsset ?? obj.updateAsset)
	    );
	  if (obj.change?.newSpotMarket ?? obj.newSpotMarket)
	    writer.bytes(
	      106,
	      _vega_NewSpotMarket.encode(obj.change?.newSpotMarket ?? obj.newSpotMarket)
	    );
	  if (obj.change?.updateSpotMarket ?? obj.updateSpotMarket)
	    writer.bytes(
	      107,
	      _vega_UpdateSpotMarket.encode(
	        obj.change?.updateSpotMarket ?? obj.updateSpotMarket
	      )
	    );
	  if (obj.change?.newTransfer ?? obj.newTransfer)
	    writer.bytes(
	      108,
	      _vega_NewTransfer.encode(obj.change?.newTransfer ?? obj.newTransfer)
	    );
	  if (obj.change?.cancelTransfer ?? obj.cancelTransfer)
	    writer.bytes(
	      109,
	      _vega_CancelTransfer.encode(
	        obj.change?.cancelTransfer ?? obj.cancelTransfer
	      )
	    );
	  if (obj.change?.updateMarketState ?? obj.updateMarketState)
	    writer.bytes(
	      110,
	      _vega_UpdateMarketState.encode(
	        obj.change?.updateMarketState ?? obj.updateMarketState
	      )
	    );
	  if (obj.change?.updateReferralProgram ?? obj.updateReferralProgram)
	    writer.bytes(
	      111,
	      _vega_UpdateReferralProgram.encode(
	        obj.change?.updateReferralProgram ?? obj.updateReferralProgram
	      )
	    );
	  if (
	    obj.change?.updateVolumeDiscountProgram ??
	    obj.updateVolumeDiscountProgram
	  )
	    writer.bytes(
	      112,
	      _vega_UpdateVolumeDiscountProgram.encode(
	        obj.change?.updateVolumeDiscountProgram ??
	          obj.updateVolumeDiscountProgram
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$E = writer;
	const { int64: int64$5 } = types$1;
	const _vega_BatchProposalTermsChange = encode$F;

	encode$G.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$E();

	  if (obj.closingTimestamp) writer.varint(1, obj.closingTimestamp, int64$5);
	  if (obj.changes?.length)
	    obj.changes.forEach((v) =>
	      writer.bytes(2, _vega_BatchProposalTermsChange.encode(v))
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$D = writer;
	const { string: string$u } = types$1;
	const _vega_commands_v1_BatchProposalSubmissionTerms = encode$G;
	const _vega_ProposalRationale = encode$19;

	encode$H.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$D();

	  if (obj.reference) writer.bytes(1, obj.reference, string$u);
	  if (obj.terms)
	    writer.bytes(
	      2,
	      _vega_commands_v1_BatchProposalSubmissionTerms.encode(obj.terms)
	    );
	  if (obj.rationale)
	    writer.bytes(3, _vega_ProposalRationale.encode(obj.rationale));

	  return writer.concat(buf, byteOffset)
	};

	var encode$E = {};

	var encode$D = {};

	/// autogenerated by protoc-plugin-js
	const Writer$C = writer;
	const { string: string$t } = types$1;

	encode$D.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$C();

	  if (obj.key) writer.bytes(1, obj.key, string$t);
	  if (obj.value) writer.bytes(2, obj.value, string$t);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$B = writer;
	const { string: string$s } = types$1;
	const _vega_Metadata = encode$D;

	encode$E.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$B();

	  if (obj.alias) writer.bytes(1, obj.alias, string$s);
	  if (obj.metadata?.length)
	    obj.metadata.forEach((v) => writer.bytes(2, _vega_Metadata.encode(v)));

	  return writer.concat(buf, byteOffset)
	};

	var encode$C = {};

	/// autogenerated by protoc-plugin-js
	const assert$3 = nanoassert;
	const { enumerable: enumerable$3 } = types$1;
	const { enumerable: decodeEnumerable$3 } = types;

	const TYPE_UNSPECIFIED = 0;
	const TYPE_STAKE_DEPOSITED = 1;
	const TYPE_STAKE_REMOVED = 2;
	const TYPE_FUNDS_DEPOSITED = 3;
	const TYPE_SIGNER_ADDED = 4;
	const TYPE_SIGNER_REMOVED = 5;
	const TYPE_BRIDGE_STOPPED = 6;
	const TYPE_BRIDGE_RESUMED = 7;
	const TYPE_ASSET_LISTED = 8;
	const TYPE_LIMITS_UPDATED = 9;
	const TYPE_STAKE_TOTAL_SUPPLY = 10;
	const TYPE_SIGNER_THRESHOLD_SET = 11;
	const TYPE_GOVERNANCE_VALIDATE_ASSET = 12;
	const TYPE_ETHEREUM_CONTRACT_CALL_RESULT = 13;

	const enumValues$3 = new Map([
	  [0, 'TYPE_UNSPECIFIED'],
	  [1, 'TYPE_STAKE_DEPOSITED'],
	  [2, 'TYPE_STAKE_REMOVED'],
	  [3, 'TYPE_FUNDS_DEPOSITED'],
	  [4, 'TYPE_SIGNER_ADDED'],
	  [5, 'TYPE_SIGNER_REMOVED'],
	  [6, 'TYPE_BRIDGE_STOPPED'],
	  [7, 'TYPE_BRIDGE_RESUMED'],
	  [8, 'TYPE_ASSET_LISTED'],
	  [9, 'TYPE_LIMITS_UPDATED'],
	  [10, 'TYPE_STAKE_TOTAL_SUPPLY'],
	  [11, 'TYPE_SIGNER_THRESHOLD_SET'],
	  [12, 'TYPE_GOVERNANCE_VALIDATE_ASSET'],
	  [13, 'TYPE_ETHEREUM_CONTRACT_CALL_RESULT']
	]);
	const enumNames$3 = new Map([
	  ['TYPE_UNSPECIFIED', 0],
	  ['TYPE_STAKE_DEPOSITED', 1],
	  ['TYPE_STAKE_REMOVED', 2],
	  ['TYPE_FUNDS_DEPOSITED', 3],
	  ['TYPE_SIGNER_ADDED', 4],
	  ['TYPE_SIGNER_REMOVED', 5],
	  ['TYPE_BRIDGE_STOPPED', 6],
	  ['TYPE_BRIDGE_RESUMED', 7],
	  ['TYPE_ASSET_LISTED', 8],
	  ['TYPE_LIMITS_UPDATED', 9],
	  ['TYPE_STAKE_TOTAL_SUPPLY', 10],
	  ['TYPE_SIGNER_THRESHOLD_SET', 11],
	  ['TYPE_GOVERNANCE_VALIDATE_ASSET', 12],
	  ['TYPE_ETHEREUM_CONTRACT_CALL_RESULT', 13]
	]);

	function encode$B(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$B(parse$3(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid Type value (' + value + ')')

	  return enumerable$3.encode(value, buf, byteOffset)
	}

	function decode$3(varint) {
	  const int = decodeEnumerable$3(varint);

	  return stringify$3(int) ?? int
	}

	function encodingLength$3(value) {
	  if (typeof value === 'string') return encodingLength$3(parse$3(value))
	  assert$3(value != null, 'Invalid Type value (' + value + ')');

	  if (0 <= value && value <= 13) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$3(int) {
	  return enumValues$3.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$3(str) {
	  return enumNames$3.get(str)
	}

	var Type = {
	  encode: encode$B,
	  decode: decode$3,
	  encodingLength: encodingLength$3,
	  stringify: stringify$3,
	  parse: parse$3,
	  TYPE_UNSPECIFIED,
	  TYPE_STAKE_DEPOSITED,
	  TYPE_STAKE_REMOVED,
	  TYPE_FUNDS_DEPOSITED,
	  TYPE_SIGNER_ADDED,
	  TYPE_SIGNER_REMOVED,
	  TYPE_BRIDGE_STOPPED,
	  TYPE_BRIDGE_RESUMED,
	  TYPE_ASSET_LISTED,
	  TYPE_LIMITS_UPDATED,
	  TYPE_STAKE_TOTAL_SUPPLY,
	  TYPE_SIGNER_THRESHOLD_SET,
	  TYPE_GOVERNANCE_VALIDATE_ASSET,
	  TYPE_ETHEREUM_CONTRACT_CALL_RESULT
	};

	/// autogenerated by protoc-plugin-js
	const Writer$A = writer;
	const { string: string$r } = types$1;
	const _vega_commands_v1_NodeVote_Type = Type;

	encode$C.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$A();

	  if (obj.reference) writer.bytes(2, obj.reference, string$r);
	  if (obj.type) writer.varint(3, obj.type, _vega_commands_v1_NodeVote_Type);

	  return writer.concat(buf, byteOffset)
	};

	var encode$A = {};

	/// autogenerated by protoc-plugin-js
	const assert$2 = nanoassert;
	const { enumerable: enumerable$2 } = types$1;
	const { enumerable: decodeEnumerable$2 } = types;

	const NODE_SIGNATURE_KIND_UNSPECIFIED = 0;
	const NODE_SIGNATURE_KIND_ASSET_NEW = 1;
	const NODE_SIGNATURE_KIND_ASSET_WITHDRAWAL = 2;
	const NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED = 3;
	const NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_REMOVED = 4;
	const NODE_SIGNATURE_KIND_ASSET_UPDATE = 5;

	const enumValues$2 = new Map([
	  [0, 'NODE_SIGNATURE_KIND_UNSPECIFIED'],
	  [1, 'NODE_SIGNATURE_KIND_ASSET_NEW'],
	  [2, 'NODE_SIGNATURE_KIND_ASSET_WITHDRAWAL'],
	  [3, 'NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED'],
	  [4, 'NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_REMOVED'],
	  [5, 'NODE_SIGNATURE_KIND_ASSET_UPDATE']
	]);
	const enumNames$2 = new Map([
	  ['NODE_SIGNATURE_KIND_UNSPECIFIED', 0],
	  ['NODE_SIGNATURE_KIND_ASSET_NEW', 1],
	  ['NODE_SIGNATURE_KIND_ASSET_WITHDRAWAL', 2],
	  ['NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED', 3],
	  ['NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_REMOVED', 4],
	  ['NODE_SIGNATURE_KIND_ASSET_UPDATE', 5]
	]);

	function encode$z(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$z(parse$2(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid NodeSignatureKind value (' + value + ')')

	  return enumerable$2.encode(value, buf, byteOffset)
	}

	function decode$2(varint) {
	  const int = decodeEnumerable$2(varint);

	  return stringify$2(int) ?? int
	}

	function encodingLength$2(value) {
	  if (typeof value === 'string') return encodingLength$2(parse$2(value))
	  assert$2(value != null, 'Invalid NodeSignatureKind value (' + value + ')');

	  if (0 <= value && value <= 5) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$2(int) {
	  return enumValues$2.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$2(str) {
	  return enumNames$2.get(str)
	}

	var NodeSignatureKind = {
	  encode: encode$z,
	  decode: decode$2,
	  encodingLength: encodingLength$2,
	  stringify: stringify$2,
	  parse: parse$2,
	  NODE_SIGNATURE_KIND_UNSPECIFIED,
	  NODE_SIGNATURE_KIND_ASSET_NEW,
	  NODE_SIGNATURE_KIND_ASSET_WITHDRAWAL,
	  NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED,
	  NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_REMOVED,
	  NODE_SIGNATURE_KIND_ASSET_UPDATE
	};

	/// autogenerated by protoc-plugin-js
	const Writer$z = writer;
	const { string: string$q, bytes: bytes$3 } = types$1;
	const _vega_commands_v1_NodeSignatureKind$1 = NodeSignatureKind;

	encode$A.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$z();

	  if (obj.id) writer.bytes(1, obj.id, string$q);
	  if (obj.sig) writer.bytes(2, obj.sig, bytes$3);
	  if (obj.kind) writer.varint(3, obj.kind, _vega_commands_v1_NodeSignatureKind$1);

	  return writer.concat(buf, byteOffset)
	};

	var encode$y = {};

	var encode$x = {};

	var encode$w = {};

	/// autogenerated by protoc-plugin-js
	const Writer$y = writer;
	const { string: string$p } = types$1;

	encode$w.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$y();

	  if (obj.vegaAssetId) writer.bytes(1, obj.vegaAssetId, string$p);
	  if (obj.partyId) writer.bytes(2, obj.partyId, string$p);
	  if (obj.amount) writer.bytes(3, obj.amount, string$p);

	  return writer.concat(buf, byteOffset)
	};

	var encode$v = {};

	/// autogenerated by protoc-plugin-js
	const Writer$x = writer;
	const { string: string$o } = types$1;

	encode$v.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$x();

	  if (obj.vegaAssetId) writer.bytes(1, obj.vegaAssetId, string$o);
	  if (obj.partyId) writer.bytes(2, obj.partyId, string$o);
	  if (obj.amount) writer.bytes(3, obj.amount, string$o);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$w = writer;

	const _vega_BuiltinAssetDeposit = encode$w;
	const _vega_BuiltinAssetWithdrawal = encode$v;

	encode$x.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$w();

	  if (obj.action?.deposit ?? obj.deposit)
	    writer.bytes(
	      1001,
	      _vega_BuiltinAssetDeposit.encode(obj.action?.deposit ?? obj.deposit)
	    );
	  if (obj.action?.withdrawal ?? obj.withdrawal)
	    writer.bytes(
	      1002,
	      _vega_BuiltinAssetWithdrawal.encode(
	        obj.action?.withdrawal ?? obj.withdrawal
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$u = {};

	var encode$t = {};

	/// autogenerated by protoc-plugin-js
	const Writer$v = writer;
	const { string: string$n } = types$1;

	encode$t.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$v();

	  if (obj.vegaAssetId) writer.bytes(1, obj.vegaAssetId, string$n);
	  if (obj.assetSource) writer.bytes(2, obj.assetSource, string$n);

	  return writer.concat(buf, byteOffset)
	};

	var encode$s = {};

	/// autogenerated by protoc-plugin-js
	const Writer$u = writer;
	const { string: string$m } = types$1;

	encode$s.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$u();

	  if (obj.vegaAssetId) writer.bytes(1, obj.vegaAssetId, string$m);

	  return writer.concat(buf, byteOffset)
	};

	var encode$r = {};

	/// autogenerated by protoc-plugin-js
	const Writer$t = writer;
	const { string: string$l } = types$1;

	encode$r.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$t();

	  if (obj.vegaAssetId) writer.bytes(1, obj.vegaAssetId, string$l);
	  if (obj.sourceEthereumAddress)
	    writer.bytes(2, obj.sourceEthereumAddress, string$l);
	  if (obj.targetPartyId) writer.bytes(3, obj.targetPartyId, string$l);
	  if (obj.amount) writer.bytes(4, obj.amount, string$l);

	  return writer.concat(buf, byteOffset)
	};

	var encode$q = {};

	/// autogenerated by protoc-plugin-js
	const Writer$s = writer;
	const { string: string$k } = types$1;

	encode$q.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$s();

	  if (obj.vegaAssetId) writer.bytes(1, obj.vegaAssetId, string$k);
	  if (obj.targetEthereumAddress)
	    writer.bytes(2, obj.targetEthereumAddress, string$k);
	  if (obj.referenceNonce) writer.bytes(3, obj.referenceNonce, string$k);

	  return writer.concat(buf, byteOffset)
	};

	var encode$p = {};

	/// autogenerated by protoc-plugin-js
	const Writer$r = writer;
	const { string: string$j } = types$1;

	encode$p.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$r();

	  if (obj.vegaAssetId) writer.bytes(1, obj.vegaAssetId, string$j);
	  if (obj.sourceEthereumAddress)
	    writer.bytes(2, obj.sourceEthereumAddress, string$j);
	  if (obj.lifetimeLimits) writer.bytes(3, obj.lifetimeLimits, string$j);
	  if (obj.withdrawThreshold) writer.bytes(4, obj.withdrawThreshold, string$j);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$q = writer;
	const { uint64: uint64$9, bool } = types$1;
	const _vega_ERC20AssetList = encode$t;
	const _vega_ERC20AssetDelist = encode$s;
	const _vega_ERC20Deposit = encode$r;
	const _vega_ERC20Withdrawal = encode$q;
	const _vega_ERC20AssetLimitsUpdated = encode$p;

	encode$u.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$q();

	  if (obj.index) writer.varint(1, obj.index, uint64$9);
	  if (obj.block) writer.varint(2, obj.block, uint64$9);

	  if (obj.action?.assetList ?? obj.assetList)
	    writer.bytes(
	      1001,
	      _vega_ERC20AssetList.encode(obj.action?.assetList ?? obj.assetList)
	    );
	  if (obj.action?.assetDelist ?? obj.assetDelist)
	    writer.bytes(
	      1002,
	      _vega_ERC20AssetDelist.encode(obj.action?.assetDelist ?? obj.assetDelist)
	    );
	  if (obj.action?.deposit ?? obj.deposit)
	    writer.bytes(
	      1003,
	      _vega_ERC20Deposit.encode(obj.action?.deposit ?? obj.deposit)
	    );
	  if (obj.action?.withdrawal ?? obj.withdrawal)
	    writer.bytes(
	      1004,
	      _vega_ERC20Withdrawal.encode(obj.action?.withdrawal ?? obj.withdrawal)
	    );
	  if (obj.action?.assetLimitsUpdated ?? obj.assetLimitsUpdated)
	    writer.bytes(
	      1005,
	      _vega_ERC20AssetLimitsUpdated.encode(
	        obj.action?.assetLimitsUpdated ?? obj.assetLimitsUpdated
	      )
	    );
	  if (obj.action?.bridgeStopped ?? obj.bridgeStopped)
	    writer.varint(1006, obj.action?.bridgeStopped ?? obj.bridgeStopped, bool);
	  if (obj.action?.bridgeResumed ?? obj.bridgeResumed)
	    writer.varint(1007, obj.action?.bridgeResumed ?? obj.bridgeResumed, bool);

	  return writer.concat(buf, byteOffset)
	};

	var encode$o = {};

	var encode$n = {};

	/// autogenerated by protoc-plugin-js
	const Writer$p = writer;
	const { string: string$i, int64: int64$4 } = types$1;

	encode$n.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$p();

	  if (obj.ethereumAddress) writer.bytes(1, obj.ethereumAddress, string$i);
	  if (obj.vegaPublicKey) writer.bytes(2, obj.vegaPublicKey, string$i);
	  if (obj.amount) writer.bytes(3, obj.amount, string$i);
	  if (obj.blockTime) writer.varint(4, obj.blockTime, int64$4);

	  return writer.concat(buf, byteOffset)
	};

	var encode$m = {};

	/// autogenerated by protoc-plugin-js
	const Writer$o = writer;
	const { string: string$h, int64: int64$3 } = types$1;

	encode$m.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$o();

	  if (obj.ethereumAddress) writer.bytes(1, obj.ethereumAddress, string$h);
	  if (obj.vegaPublicKey) writer.bytes(2, obj.vegaPublicKey, string$h);
	  if (obj.amount) writer.bytes(3, obj.amount, string$h);
	  if (obj.blockTime) writer.varint(4, obj.blockTime, int64$3);

	  return writer.concat(buf, byteOffset)
	};

	var encode$l = {};

	/// autogenerated by protoc-plugin-js
	const Writer$n = writer;
	const { string: string$g } = types$1;

	encode$l.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$n();

	  if (obj.tokenAddress) writer.bytes(1, obj.tokenAddress, string$g);
	  if (obj.totalSupply) writer.bytes(2, obj.totalSupply, string$g);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$m = writer;
	const { uint64: uint64$8 } = types$1;
	const _vega_StakeDeposited = encode$n;
	const _vega_StakeRemoved = encode$m;
	const _vega_StakeTotalSupply = encode$l;

	encode$o.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$m();

	  if (obj.index) writer.varint(1, obj.index, uint64$8);
	  if (obj.block) writer.varint(2, obj.block, uint64$8);

	  if (obj.action?.stakeDeposited ?? obj.stakeDeposited)
	    writer.bytes(
	      1001,
	      _vega_StakeDeposited.encode(
	        obj.action?.stakeDeposited ?? obj.stakeDeposited
	      )
	    );
	  if (obj.action?.stakeRemoved ?? obj.stakeRemoved)
	    writer.bytes(
	      1002,
	      _vega_StakeRemoved.encode(obj.action?.stakeRemoved ?? obj.stakeRemoved)
	    );
	  if (obj.action?.totalSupply ?? obj.totalSupply)
	    writer.bytes(
	      1003,
	      _vega_StakeTotalSupply.encode(obj.action?.totalSupply ?? obj.totalSupply)
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$k = {};

	var encode$j = {};

	/// autogenerated by protoc-plugin-js
	const Writer$l = writer;
	const { string: string$f, int64: int64$2 } = types$1;

	encode$j.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$l();

	  if (obj.newSigner) writer.bytes(1, obj.newSigner, string$f);
	  if (obj.nonce) writer.bytes(2, obj.nonce, string$f);
	  if (obj.blockTime) writer.varint(3, obj.blockTime, int64$2);

	  return writer.concat(buf, byteOffset)
	};

	var encode$i = {};

	/// autogenerated by protoc-plugin-js
	const Writer$k = writer;
	const { string: string$e, int64: int64$1 } = types$1;

	encode$i.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$k();

	  if (obj.oldSigner) writer.bytes(1, obj.oldSigner, string$e);
	  if (obj.nonce) writer.bytes(2, obj.nonce, string$e);
	  if (obj.blockTime) writer.varint(3, obj.blockTime, int64$1);

	  return writer.concat(buf, byteOffset)
	};

	var encode$h = {};

	/// autogenerated by protoc-plugin-js
	const Writer$j = writer;
	const { uint32: uint32$1, string: string$d, int64 } = types$1;

	encode$h.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$j();

	  if (obj.newThreshold) writer.varint(1, obj.newThreshold, uint32$1);
	  if (obj.nonce) writer.bytes(2, obj.nonce, string$d);
	  if (obj.blockTime) writer.varint(3, obj.blockTime, int64);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$i = writer;
	const { uint64: uint64$7 } = types$1;
	const _vega_ERC20SignerAdded = encode$j;
	const _vega_ERC20SignerRemoved = encode$i;
	const _vega_ERC20ThresholdSet = encode$h;

	encode$k.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$i();

	  if (obj.index) writer.varint(1, obj.index, uint64$7);
	  if (obj.block) writer.varint(2, obj.block, uint64$7);

	  if (obj.action?.signerAdded ?? obj.signerAdded)
	    writer.bytes(
	      1001,
	      _vega_ERC20SignerAdded.encode(obj.action?.signerAdded ?? obj.signerAdded)
	    );
	  if (obj.action?.signerRemoved ?? obj.signerRemoved)
	    writer.bytes(
	      1002,
	      _vega_ERC20SignerRemoved.encode(
	        obj.action?.signerRemoved ?? obj.signerRemoved
	      )
	    );
	  if (obj.action?.thresholdSet ?? obj.thresholdSet)
	    writer.bytes(
	      1003,
	      _vega_ERC20ThresholdSet.encode(
	        obj.action?.thresholdSet ?? obj.thresholdSet
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$g = {};

	/// autogenerated by protoc-plugin-js
	const Writer$h = writer;
	const { string: string$c, uint64: uint64$6, bytes: bytes$2 } = types$1;

	encode$g.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$h();

	  if (obj.specId) writer.bytes(1, obj.specId, string$c);
	  if (obj.blockHeight) writer.varint(2, obj.blockHeight, uint64$6);
	  if (obj.blockTime) writer.varint(3, obj.blockTime, uint64$6);
	  if (obj.result) writer.bytes(4, obj.result, bytes$2);
	  if (obj.error) writer.bytes(5, obj.error, string$c);
	  if (obj.sourceChainId) writer.varint(6, obj.sourceChainId, uint64$6);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$g = writer;
	const { string: string$b, uint64: uint64$5 } = types$1;
	const _vega_BuiltinAssetEvent = encode$x;
	const _vega_ERC20Event = encode$u;
	const _vega_StakingEvent = encode$o;
	const _vega_ERC20MultiSigEvent = encode$k;
	const _vega_EthContractCallEvent = encode$g;

	encode$y.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$g();

	  if (obj.txId) writer.bytes(1, obj.txId, string$b);
	  if (obj.nonce) writer.varint(2, obj.nonce, uint64$5);

	  if (obj.event?.builtin ?? obj.builtin)
	    writer.bytes(
	      1001,
	      _vega_BuiltinAssetEvent.encode(obj.event?.builtin ?? obj.builtin)
	    );
	  if (obj.event?.erc20 ?? obj.erc20)
	    writer.bytes(1002, _vega_ERC20Event.encode(obj.event?.erc20 ?? obj.erc20));
	  if (obj.event?.stakingEvent ?? obj.stakingEvent)
	    writer.bytes(
	      1005,
	      _vega_StakingEvent.encode(obj.event?.stakingEvent ?? obj.stakingEvent)
	    );
	  if (obj.event?.erc20Multisig ?? obj.erc20Multisig)
	    writer.bytes(
	      1006,
	      _vega_ERC20MultiSigEvent.encode(
	        obj.event?.erc20Multisig ?? obj.erc20Multisig
	      )
	    );
	  if (obj.event?.contractCall ?? obj.contractCall)
	    writer.bytes(
	      1007,
	      _vega_EthContractCallEvent.encode(
	        obj.event?.contractCall ?? obj.contractCall
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	var encode$f = {};

	/// autogenerated by protoc-plugin-js
	const Writer$f = writer;
	const { uint32, uint64: uint64$4, string: string$a } = types$1;

	encode$f.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$f();

	  if (obj.newPubKeyIndex) writer.varint(1, obj.newPubKeyIndex, uint32);
	  if (obj.targetBlock) writer.varint(2, obj.targetBlock, uint64$4);
	  if (obj.newPubKey) writer.bytes(3, obj.newPubKey, string$a);
	  if (obj.currentPubKeyHash) writer.bytes(4, obj.currentPubKeyHash, string$a);

	  return writer.concat(buf, byteOffset)
	};

	var encode$e = {};

	var encode$d = {};

	var encode$c = {};

	var encode$b = {};

	var encode$a = {};

	/// autogenerated by protoc-plugin-js
	const Writer$e = writer;
	const { string: string$9 } = types$1;

	encode$a.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$e();

	  if (obj.value) writer.bytes(1, obj.value, string$9);

	  return writer.concat(buf, byteOffset)
	};

	var encode$9 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$d = writer;
	const { string: string$8 } = types$1;

	encode$9.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$d();

	  if (obj.value?.length) obj.value.forEach((v) => writer.bytes(1, v, string$8));

	  return writer.concat(buf, byteOffset)
	};

	var encode$8 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$c = writer;

	const _vega_VectorValue$1 = encode$9;

	encode$8.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$c();

	  if (obj.value?.length)
	    obj.value.forEach((v) => writer.bytes(1, _vega_VectorValue$1.encode(v)));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$b = writer;

	const _vega_ScalarValue = encode$a;
	const _vega_VectorValue = encode$9;
	const _vega_MatrixValue = encode$8;

	encode$b.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$b();

	  if (obj.value?.scalarVal ?? obj.scalarVal)
	    writer.bytes(
	      1,
	      _vega_ScalarValue.encode(obj.value?.scalarVal ?? obj.scalarVal)
	    );
	  if (obj.value?.vectorVal ?? obj.vectorVal)
	    writer.bytes(
	      2,
	      _vega_VectorValue.encode(obj.value?.vectorVal ?? obj.vectorVal)
	    );
	  if (obj.value?.matrixVal ?? obj.matrixVal)
	    writer.bytes(
	      3,
	      _vega_MatrixValue.encode(obj.value?.matrixVal ?? obj.matrixVal)
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$a = writer;
	const { string: string$7 } = types$1;
	const _vega_StateVarValue = encode$b;

	encode$c.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$a();

	  if (obj.key) writer.bytes(1, obj.key, string$7);
	  if (obj.tolerance) writer.bytes(2, obj.tolerance, string$7);
	  if (obj.value) writer.bytes(3, _vega_StateVarValue.encode(obj.value));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$9 = writer;
	const { string: string$6 } = types$1;
	const _vega_KeyValueBundle = encode$c;

	encode$d.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$9();

	  if (obj.stateVarId) writer.bytes(1, obj.stateVarId, string$6);
	  if (obj.eventId) writer.bytes(2, obj.eventId, string$6);
	  if (obj.kvb?.length)
	    obj.kvb.forEach((v) => writer.bytes(3, _vega_KeyValueBundle.encode(v)));

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$8 = writer;

	const _vega_StateValueProposal = encode$d;

	encode$e.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$8();

	  if (obj.proposal)
	    writer.bytes(1, _vega_StateValueProposal.encode(obj.proposal));

	  return writer.concat(buf, byteOffset)
	};

	var encode$7 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$7 = writer;
	const { string: string$5 } = types$1;
	const _vega_commands_v1_Signature$2 = encode$X;

	encode$7.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$7();

	  if (obj.nodeId) writer.bytes(1, obj.nodeId, string$5);
	  if (obj.ethereumSignature)
	    writer.bytes(2, _vega_commands_v1_Signature$2.encode(obj.ethereumSignature));
	  if (obj.vegaSignature)
	    writer.bytes(3, _vega_commands_v1_Signature$2.encode(obj.vegaSignature));
	  if (obj.message) writer.bytes(4, obj.message, string$5);

	  return writer.concat(buf, byteOffset)
	};

	var encode$6 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$6 = writer;
	const { uint64: uint64$3, string: string$4 } = types$1;
	const _vega_commands_v1_Signature$1 = encode$X;

	encode$6.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$6();

	  if (obj.targetBlock) writer.varint(1, obj.targetBlock, uint64$3);
	  if (obj.newAddress) writer.bytes(2, obj.newAddress, string$4);
	  if (obj.currentAddress) writer.bytes(3, obj.currentAddress, string$4);
	  if (obj.submitterAddress) writer.bytes(4, obj.submitterAddress, string$4);
	  if (obj.ethereumSignature)
	    writer.bytes(5, _vega_commands_v1_Signature$1.encode(obj.ethereumSignature));

	  return writer.concat(buf, byteOffset)
	};

	var encode$5 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$5 = writer;
	const { uint64: uint64$2, string: string$3 } = types$1;

	encode$5.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$5();

	  if (obj.upgradeBlockHeight) writer.varint(1, obj.upgradeBlockHeight, uint64$2);
	  if (obj.vegaReleaseTag) writer.bytes(2, obj.vegaReleaseTag, string$3);

	  return writer.concat(buf, byteOffset)
	};

	var encode$4 = {};

	/// autogenerated by protoc-plugin-js
	const Writer$4 = writer;
	const { string: string$2 } = types$1;
	const _vega_commands_v1_NodeSignatureKind = NodeSignatureKind;

	encode$4.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$4();

	  if (obj.submitter) writer.bytes(1, obj.submitter, string$2);
	  if (obj.kind) writer.varint(2, obj.kind, _vega_commands_v1_NodeSignatureKind);
	  if (obj.validatorNodeId) writer.bytes(3, obj.validatorNodeId, string$2);

	  return writer.concat(buf, byteOffset)
	};

	var encode$3 = {};

	/// autogenerated by protoc-plugin-js
	const assert$1 = nanoassert;
	const { enumerable: enumerable$1 } = types$1;
	const { enumerable: decodeEnumerable$1 } = types;

	const ORACLE_SOURCE_UNSPECIFIED = 0;
	const ORACLE_SOURCE_OPEN_ORACLE = 1;
	const ORACLE_SOURCE_JSON = 2;
	const ORACLE_SOURCE_ETHEREUM = 3;

	const enumValues$1 = new Map([
	  [0, 'ORACLE_SOURCE_UNSPECIFIED'],
	  [1, 'ORACLE_SOURCE_OPEN_ORACLE'],
	  [2, 'ORACLE_SOURCE_JSON'],
	  [3, 'ORACLE_SOURCE_ETHEREUM']
	]);
	const enumNames$1 = new Map([
	  ['ORACLE_SOURCE_UNSPECIFIED', 0],
	  ['ORACLE_SOURCE_OPEN_ORACLE', 1],
	  ['ORACLE_SOURCE_JSON', 2],
	  ['ORACLE_SOURCE_ETHEREUM', 3]
	]);

	function encode$2(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$2(parse$1(value), buf, byteOffset)
	  if (value == null)
	    throw new Error('Invalid OracleSource value (' + value + ')')

	  return enumerable$1.encode(value, buf, byteOffset)
	}

	function decode$1(varint) {
	  const int = decodeEnumerable$1(varint);

	  return stringify$1(int) ?? int
	}

	function encodingLength$1(value) {
	  if (typeof value === 'string') return encodingLength$1(parse$1(value))
	  assert$1(value != null, 'Invalid OracleSource value (' + value + ')');

	  if (0 <= value && value <= 3) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify$1(int) {
	  return enumValues$1.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse$1(str) {
	  return enumNames$1.get(str)
	}

	var OracleSource = {
	  encode: encode$2,
	  decode: decode$1,
	  encodingLength: encodingLength$1,
	  stringify: stringify$1,
	  parse: parse$1,
	  ORACLE_SOURCE_UNSPECIFIED,
	  ORACLE_SOURCE_OPEN_ORACLE,
	  ORACLE_SOURCE_JSON,
	  ORACLE_SOURCE_ETHEREUM
	};

	/// autogenerated by protoc-plugin-js
	const Writer$3 = writer;
	const { bytes: bytes$1 } = types$1;
	const _vega_commands_v1_OracleDataSubmission_OracleSource = OracleSource;

	encode$3.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$3();

	  if (obj.source)
	    writer.varint(
	      1,
	      obj.source,
	      _vega_commands_v1_OracleDataSubmission_OracleSource
	    );
	  if (obj.payload) writer.bytes(2, obj.payload, bytes$1);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer$2 = writer;
	const { uint64: uint64$1 } = types$1;
	const _vega_commands_v1_OrderSubmission = encode$2N;
	const _vega_commands_v1_OrderCancellation = encode$2G;
	const _vega_commands_v1_OrderAmendment = encode$2F;
	const _vega_commands_v1_WithdrawSubmission = encode$2E;
	const _vega_commands_v1_ProposalSubmission = encode$2B;
	const _vega_commands_v1_VoteSubmission = encode$18;
	const _vega_commands_v1_LiquidityProvisionSubmission = encode$16;
	const _vega_commands_v1_DelegateSubmission = encode$15;
	const _vega_commands_v1_UndelegateSubmission = encode$14;
	const _vega_commands_v1_LiquidityProvisionCancellation = encode$12;
	const _vega_commands_v1_LiquidityProvisionAmendment = encode$11;
	const _vega_commands_v1_Transfer = encode$10;
	const _vega_commands_v1_CancelTransfer = encode$Z;
	const _vega_commands_v1_AnnounceNode = encode$Y;
	const _vega_commands_v1_BatchMarketInstructions = encode$W;
	const _vega_commands_v1_StopOrdersSubmission = encode$U;
	const _vega_commands_v1_StopOrdersCancellation = encode$V;
	const _vega_commands_v1_CreateReferralSet = encode$N;
	const _vega_commands_v1_UpdateReferralSet = encode$L;
	const _vega_commands_v1_ApplyReferralCode = encode$J;
	const _vega_commands_v1_UpdateMarginMode = encode$P;
	const _vega_commands_v1_JoinTeam = encode$I;
	const _vega_commands_v1_BatchProposalSubmission = encode$H;
	const _vega_commands_v1_UpdatePartyProfile = encode$E;
	const _vega_commands_v1_NodeVote = encode$C;
	const _vega_commands_v1_NodeSignature = encode$A;
	const _vega_commands_v1_ChainEvent = encode$y;
	const _vega_commands_v1_KeyRotateSubmission = encode$f;
	const _vega_commands_v1_StateVariableProposal = encode$e;
	const _vega_commands_v1_ValidatorHeartbeat = encode$7;
	const _vega_commands_v1_EthereumKeyRotateSubmission = encode$6;
	const _vega_commands_v1_ProtocolUpgradeProposal = encode$5;
	const _vega_commands_v1_IssueSignatures = encode$4;
	const _vega_commands_v1_OracleDataSubmission = encode$3;

	var encode_1$1 = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$2();

	  if (obj.nonce) writer.varint(1, obj.nonce, uint64$1);
	  if (obj.blockHeight) writer.varint(2, obj.blockHeight, uint64$1);

	  if (obj.command?.orderSubmission ?? obj.orderSubmission)
	    writer.bytes(
	      1001,
	      _vega_commands_v1_OrderSubmission.encode(
	        obj.command?.orderSubmission ?? obj.orderSubmission
	      )
	    );
	  if (obj.command?.orderCancellation ?? obj.orderCancellation)
	    writer.bytes(
	      1002,
	      _vega_commands_v1_OrderCancellation.encode(
	        obj.command?.orderCancellation ?? obj.orderCancellation
	      )
	    );
	  if (obj.command?.orderAmendment ?? obj.orderAmendment)
	    writer.bytes(
	      1003,
	      _vega_commands_v1_OrderAmendment.encode(
	        obj.command?.orderAmendment ?? obj.orderAmendment
	      )
	    );
	  if (obj.command?.withdrawSubmission ?? obj.withdrawSubmission)
	    writer.bytes(
	      1004,
	      _vega_commands_v1_WithdrawSubmission.encode(
	        obj.command?.withdrawSubmission ?? obj.withdrawSubmission
	      )
	    );
	  if (obj.command?.proposalSubmission ?? obj.proposalSubmission)
	    writer.bytes(
	      1005,
	      _vega_commands_v1_ProposalSubmission.encode(
	        obj.command?.proposalSubmission ?? obj.proposalSubmission
	      )
	    );
	  if (obj.command?.voteSubmission ?? obj.voteSubmission)
	    writer.bytes(
	      1006,
	      _vega_commands_v1_VoteSubmission.encode(
	        obj.command?.voteSubmission ?? obj.voteSubmission
	      )
	    );
	  if (
	    obj.command?.liquidityProvisionSubmission ??
	    obj.liquidityProvisionSubmission
	  )
	    writer.bytes(
	      1007,
	      _vega_commands_v1_LiquidityProvisionSubmission.encode(
	        obj.command?.liquidityProvisionSubmission ??
	          obj.liquidityProvisionSubmission
	      )
	    );
	  if (obj.command?.delegateSubmission ?? obj.delegateSubmission)
	    writer.bytes(
	      1008,
	      _vega_commands_v1_DelegateSubmission.encode(
	        obj.command?.delegateSubmission ?? obj.delegateSubmission
	      )
	    );
	  if (obj.command?.undelegateSubmission ?? obj.undelegateSubmission)
	    writer.bytes(
	      1009,
	      _vega_commands_v1_UndelegateSubmission.encode(
	        obj.command?.undelegateSubmission ?? obj.undelegateSubmission
	      )
	    );
	  if (
	    obj.command?.liquidityProvisionCancellation ??
	    obj.liquidityProvisionCancellation
	  )
	    writer.bytes(
	      1010,
	      _vega_commands_v1_LiquidityProvisionCancellation.encode(
	        obj.command?.liquidityProvisionCancellation ??
	          obj.liquidityProvisionCancellation
	      )
	    );
	  if (
	    obj.command?.liquidityProvisionAmendment ??
	    obj.liquidityProvisionAmendment
	  )
	    writer.bytes(
	      1011,
	      _vega_commands_v1_LiquidityProvisionAmendment.encode(
	        obj.command?.liquidityProvisionAmendment ??
	          obj.liquidityProvisionAmendment
	      )
	    );
	  if (obj.command?.transfer ?? obj.transfer)
	    writer.bytes(
	      1012,
	      _vega_commands_v1_Transfer.encode(obj.command?.transfer ?? obj.transfer)
	    );
	  if (obj.command?.cancelTransfer ?? obj.cancelTransfer)
	    writer.bytes(
	      1013,
	      _vega_commands_v1_CancelTransfer.encode(
	        obj.command?.cancelTransfer ?? obj.cancelTransfer
	      )
	    );
	  if (obj.command?.announceNode ?? obj.announceNode)
	    writer.bytes(
	      1014,
	      _vega_commands_v1_AnnounceNode.encode(
	        obj.command?.announceNode ?? obj.announceNode
	      )
	    );
	  if (obj.command?.batchMarketInstructions ?? obj.batchMarketInstructions)
	    writer.bytes(
	      1015,
	      _vega_commands_v1_BatchMarketInstructions.encode(
	        obj.command?.batchMarketInstructions ?? obj.batchMarketInstructions
	      )
	    );
	  if (obj.command?.stopOrdersSubmission ?? obj.stopOrdersSubmission)
	    writer.bytes(
	      1016,
	      _vega_commands_v1_StopOrdersSubmission.encode(
	        obj.command?.stopOrdersSubmission ?? obj.stopOrdersSubmission
	      )
	    );
	  if (obj.command?.stopOrdersCancellation ?? obj.stopOrdersCancellation)
	    writer.bytes(
	      1017,
	      _vega_commands_v1_StopOrdersCancellation.encode(
	        obj.command?.stopOrdersCancellation ?? obj.stopOrdersCancellation
	      )
	    );
	  if (obj.command?.createReferralSet ?? obj.createReferralSet)
	    writer.bytes(
	      1018,
	      _vega_commands_v1_CreateReferralSet.encode(
	        obj.command?.createReferralSet ?? obj.createReferralSet
	      )
	    );
	  if (obj.command?.updateReferralSet ?? obj.updateReferralSet)
	    writer.bytes(
	      1019,
	      _vega_commands_v1_UpdateReferralSet.encode(
	        obj.command?.updateReferralSet ?? obj.updateReferralSet
	      )
	    );
	  if (obj.command?.applyReferralCode ?? obj.applyReferralCode)
	    writer.bytes(
	      1020,
	      _vega_commands_v1_ApplyReferralCode.encode(
	        obj.command?.applyReferralCode ?? obj.applyReferralCode
	      )
	    );
	  if (obj.command?.updateMarginMode ?? obj.updateMarginMode)
	    writer.bytes(
	      1021,
	      _vega_commands_v1_UpdateMarginMode.encode(
	        obj.command?.updateMarginMode ?? obj.updateMarginMode
	      )
	    );
	  if (obj.command?.joinTeam ?? obj.joinTeam)
	    writer.bytes(
	      1022,
	      _vega_commands_v1_JoinTeam.encode(obj.command?.joinTeam ?? obj.joinTeam)
	    );
	  if (obj.command?.batchProposalSubmission ?? obj.batchProposalSubmission)
	    writer.bytes(
	      1023,
	      _vega_commands_v1_BatchProposalSubmission.encode(
	        obj.command?.batchProposalSubmission ?? obj.batchProposalSubmission
	      )
	    );
	  if (obj.command?.updatePartyProfile ?? obj.updatePartyProfile)
	    writer.bytes(
	      1024,
	      _vega_commands_v1_UpdatePartyProfile.encode(
	        obj.command?.updatePartyProfile ?? obj.updatePartyProfile
	      )
	    );
	  if (obj.command?.nodeVote ?? obj.nodeVote)
	    writer.bytes(
	      2002,
	      _vega_commands_v1_NodeVote.encode(obj.command?.nodeVote ?? obj.nodeVote)
	    );
	  if (obj.command?.nodeSignature ?? obj.nodeSignature)
	    writer.bytes(
	      2003,
	      _vega_commands_v1_NodeSignature.encode(
	        obj.command?.nodeSignature ?? obj.nodeSignature
	      )
	    );
	  if (obj.command?.chainEvent ?? obj.chainEvent)
	    writer.bytes(
	      2004,
	      _vega_commands_v1_ChainEvent.encode(
	        obj.command?.chainEvent ?? obj.chainEvent
	      )
	    );
	  if (obj.command?.keyRotateSubmission ?? obj.keyRotateSubmission)
	    writer.bytes(
	      2005,
	      _vega_commands_v1_KeyRotateSubmission.encode(
	        obj.command?.keyRotateSubmission ?? obj.keyRotateSubmission
	      )
	    );
	  if (obj.command?.stateVariableProposal ?? obj.stateVariableProposal)
	    writer.bytes(
	      2006,
	      _vega_commands_v1_StateVariableProposal.encode(
	        obj.command?.stateVariableProposal ?? obj.stateVariableProposal
	      )
	    );
	  if (obj.command?.validatorHeartbeat ?? obj.validatorHeartbeat)
	    writer.bytes(
	      2007,
	      _vega_commands_v1_ValidatorHeartbeat.encode(
	        obj.command?.validatorHeartbeat ?? obj.validatorHeartbeat
	      )
	    );
	  if (
	    obj.command?.ethereumKeyRotateSubmission ??
	    obj.ethereumKeyRotateSubmission
	  )
	    writer.bytes(
	      2008,
	      _vega_commands_v1_EthereumKeyRotateSubmission.encode(
	        obj.command?.ethereumKeyRotateSubmission ??
	          obj.ethereumKeyRotateSubmission
	      )
	    );
	  if (obj.command?.protocolUpgradeProposal ?? obj.protocolUpgradeProposal)
	    writer.bytes(
	      2009,
	      _vega_commands_v1_ProtocolUpgradeProposal.encode(
	        obj.command?.protocolUpgradeProposal ?? obj.protocolUpgradeProposal
	      )
	    );
	  if (obj.command?.issueSignatures ?? obj.issueSignatures)
	    writer.bytes(
	      2010,
	      _vega_commands_v1_IssueSignatures.encode(
	        obj.command?.issueSignatures ?? obj.issueSignatures
	      )
	    );
	  if (obj.command?.oracleDataSubmission ?? obj.oracleDataSubmission)
	    writer.bytes(
	      3001,
	      _vega_commands_v1_OracleDataSubmission.encode(
	        obj.command?.oracleDataSubmission ?? obj.oracleDataSubmission
	      )
	    );

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const assert = nanoassert;
	const { enumerable } = types$1;
	const { enumerable: decodeEnumerable } = types;

	const TX_VERSION_UNSPECIFIED = 0;
	const TX_VERSION_V2 = 2;
	const TX_VERSION_V3 = 3;

	const enumValues = new Map([
	  [0, 'TX_VERSION_UNSPECIFIED'],
	  [2, 'TX_VERSION_V2'],
	  [3, 'TX_VERSION_V3']
	]);
	const enumNames = new Map([
	  ['TX_VERSION_UNSPECIFIED', 0],
	  ['TX_VERSION_V2', 2],
	  ['TX_VERSION_V3', 3]
	]);

	function encode$1(value, buf, byteOffset = 0) {
	  if (typeof value === 'string') return encode$1(parse(value), buf, byteOffset)
	  if (value == null) throw new Error('Invalid TxVersion value (' + value + ')')

	  return enumerable.encode(value, buf, byteOffset)
	}

	function decode(varint) {
	  const int = decodeEnumerable(varint);

	  return stringify(int) ?? int
	}

	function encodingLength(value) {
	  if (typeof value === 'string') return encodingLength(parse(value))
	  assert(value != null, 'Invalid TxVersion value (' + value + ')');

	  if (0 <= value && value <= 3) return 1

	  // enumerable max value in case of unknown value
	  return 5
	}

	/**
	 * Convert an enum value to it's human readable name.
	 * Returns undefined on an unknown value.
	 */
	function stringify(int) {
	  return enumValues.get(int)
	}

	/**
	 * Convert an enum string names to it's machine integer value.
	 * Returns undefined on an unknown name.
	 */
	function parse(str) {
	  return enumNames.get(str)
	}

	var TxVersion = {
	  encode: encode$1,
	  decode,
	  encodingLength,
	  stringify,
	  parse,
	  TX_VERSION_UNSPECIFIED,
	  TX_VERSION_V2,
	  TX_VERSION_V3
	};

	var encode = {};

	/// autogenerated by protoc-plugin-js
	const Writer$1 = writer;
	const { string: string$1, uint64 } = types$1;

	encode.encode = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer$1();

	  if (obj.tid) writer.bytes(1, obj.tid, string$1);
	  if (obj.nonce) writer.varint(2, obj.nonce, uint64);

	  return writer.concat(buf, byteOffset)
	};

	/// autogenerated by protoc-plugin-js
	const Writer = writer;
	const { bytes, string } = types$1;
	const _vega_commands_v1_Signature = encode$X;
	const _vega_commands_v1_TxVersion = TxVersion;
	const _vega_commands_v1_ProofOfWork = encode;

	var encode_1 = function encode(obj = {}, buf, byteOffset = 0) {
	  const writer = new Writer();

	  if (obj.inputData) writer.bytes(1, obj.inputData, bytes);
	  if (obj.signature)
	    writer.bytes(2, _vega_commands_v1_Signature.encode(obj.signature));
	  if (obj.version) writer.varint(2000, obj.version, _vega_commands_v1_TxVersion);
	  if (obj.pow) writer.bytes(3000, _vega_commands_v1_ProofOfWork.encode(obj.pow));

	  if (obj.from?.address ?? obj.address)
	    writer.bytes(1001, obj.from?.address ?? obj.address, string);
	  if (obj.from?.pubKey ?? obj.pubKey)
	    writer.bytes(1002, obj.from?.pubKey ?? obj.pubKey, string);

	  return writer.concat(buf, byteOffset)
	};

	function inprocess() {
	  return async function(args) {
	    return solve$1(args.difficulty, args.blockHash, args.tid)
	  }
	}

	const runtime$2 = globalThis.browser?.runtime ?? globalThis.chrome?.runtime;

	// "Mutex" for creating offscreen documents
	let offscreenDocumentPending = null;
	async function initChrome() {
	  if (globalThis?.chrome?.offscreen == null) return false

	  const OFFSCREEN_DOCUMENT_URL = runtime$2.getURL('chrome-pow.html');

	  /* istanbul ignore next */
	  const client = new JSONRPCClient({
	    idPrefix: 'chrome-pow-',
	    async send(req) {
	      // Not sure we need to do this here, however the life-cycle of offscreen documents seems to be
	      // independent of the background life-cycle.
	      // If it turns out we can rely on the document living for at least as long as the background process
	      // we can move this call to the start of the closure
	      await ensureOffscreenDocument();

	      chrome.runtime.sendMessage({
	        target: 'offscreen',
	        data: req
	      });
	    }
	  });

	  /* istanbul ignore next */
	  runtime$2.onMessage.addListener(function listener(message, sender) {
	    // ensure sender.id is the same as this extension id
	    if (sender.id !== chrome.runtime.id) return

	    // ensure message is from the offscreen document
	    if (sender.url !== OFFSCREEN_DOCUMENT_URL) return

	    if (message.target !== 'offscreen') return

	    client.onmessage(message.data);
	  });

	  return async function(args) {
	    const sol = await client.request('solve', args);

	    sol.nonce = BigInt(sol.nonce);

	    return sol
	  }

	  /* istanbul ignore next */
	  async function ensureOffscreenDocument() {
	    // Is the page still alive?
	    if (await hasDocument()) return

	    // Are we concurrently trying to create the page?
	    if (offscreenDocumentPending != null) return await offscreenDocumentPending

	    offscreenDocumentPending = globalThis.chrome.offscreen.createDocument({
	      url: OFFSCREEN_DOCUMENT_URL,
	      reasons: ['WORKERS'],
	      justification: 'This will speed up Vega transaction creation by solving anti-spam PoW challenges in parallel'
	    });

	    await offscreenDocumentPending;
	    // Cleanup after, so next call does not await a page that might be removed
	    offscreenDocumentPending = null;
	  }

	  /* istanbul ignore next */
	  async function hasDocument() {
	    const allClients = await globalThis.clients.matchAll();
	    return allClients.some((client) => client.url === OFFSCREEN_DOCUMENT_URL)
	  }
	}

	const runtime$1 = globalThis.browser?.runtime ?? globalThis.chrome?.runtime;

	const U64_MAX = 2n ** 64n - 1n;

	// Increase to make buckets twice as big, which will make
	// the amount of wasted work grow by a factor of NUM_WORKERS - 1, but
	// also make the overhead smaller (messages, context switch out of WASM when solving)
	const BUCKET_SIZE = 14n;

	const PARTITION_DIVISOR = U64_MAX >> BUCKET_SIZE;

	async function initWorkers () {
	  if (globalThis?.Worker == null || globalThis?.navigator?.hardwareConcurrency == null) return false

	  const WORKER_SCRIPT_URL = runtime$1.getURL('pow-worker.js');

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
	            const startNonce = (BigInt(i + j) * U64_MAX) / BigInt(PARTITION_DIVISOR);
	            const endNonce = (BigInt(i + j + 1) * U64_MAX) / BigInt(PARTITION_DIVISOR);

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

	const solver = (async () => {
	  const pow = await initWorkers() || await initChrome() || inprocess();

	  return pow
	})();

	async function solve(args) {
	  const pow = await solver;

	  return pow(args)
	}

	async function createTransactionData({rpc, keys, transaction}) {
	  const latestBlock = await rpc.blockchainHeight();
	  const tid = toHex(await randomFill(new Uint8Array(32)));

	  const pow = await solve({
	    difficulty: latestBlock.spamPowDifficulty,
	    blockHash: latestBlock.hash,
	    tid
	  });

	  const nonce = new DataView(await randomFill(new Uint8Array(8)).buffer).getBigUint64(0, false);

	  const inputData = encode_1$1({
	    blockHeight: BigInt(latestBlock.height),
	    nonce,
	    command: transaction
	  });

	  const chainId = latestBlock.chainId;

	  const txData = {
	    inputData,
	    signature: {
	      value: toHex(await keys.sign(inputData, chainId)),
	      algo: keys.algorithm.name,
	      version: keys.algorithm.version
	    },
	    from: {
	      pubKey: keys.publicKey.toString()
	    },
	    version: TxVersion.TX_VERSION_V3,
	    pow
	  };

	  const tx = encode_1(txData);

	  const txJSON = {
	    inputData: toBase64(inputData),
	    signature: {
	      value: txData.signature.value,
	      algo: txData.signature.algo,
	      version: txData.signature.version
	    },
	    from: {
	      pubKey: txData.from.pubKey
	    },
	    version: txData.version,
	    pow: {
	      tid: toHex(tid),
	      nonce: pow.nonce.toString()
	    }
	  };

	  const base64Tx = await toBase64(tx);

	  return {
	    tx, 
	    base64Tx, 
	    txJSON
	  }
	}

	async function sendTransaction({rpc, keys, transaction, sendingMode}) {
	  const txData = await createTransactionData({rpc, keys, transaction});
	  const sentAt = new Date().toISOString();
	  const res = await rpc.submitRawTransaction(
	    txData.base64Tx,
	    sendingMode
	  );

	  return {
	    sentAt,
	    transactionHash: res.txHash,
	    transaction: txData.txJSON
	  }
	}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$5(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){for(const key0 in data){if(!(key0 === "chainId")){const err0 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}}if(data.chainId !== undefined){if(typeof data.chainId !== "string"){const err1 = {instancePath:instancePath+"/chainId",schemaPath:"#/properties/chainId/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}}else {const err2 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}validate14$5.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$4(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(errors > 0){const emErrs0 = [];for(const err1 of vErrors){if(((((err1.keyword !== "errorMessage") && (!err1.emUsed)) && ((err1.instancePath === instancePath) || ((err1.instancePath.indexOf(instancePath) === 0) && (err1.instancePath[instancePath.length] === "/")))) && (err1.schemaPath.indexOf("#") === 0)) && (err1.schemaPath["#".length] === "/")){emErrs0.push(err1);err1.emUsed = true;}}if(emErrs0.length){const err2 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`client.disconnect_wallet` does not take any parameters"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}const emErrs1 = [];for(const err3 of vErrors){if(!err3.emUsed){emErrs1.push(err3);}}vErrors = emErrs1;errors = emErrs1.length;}validate14$4.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$3(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(errors > 0){const emErrs0 = [];for(const err1 of vErrors){if(((((err1.keyword !== "errorMessage") && (!err1.emUsed)) && ((err1.instancePath === instancePath) || ((err1.instancePath.indexOf(instancePath) === 0) && (err1.instancePath[instancePath.length] === "/")))) && (err1.schemaPath.indexOf("#") === 0)) && (err1.schemaPath["#".length] === "/")){emErrs0.push(err1);err1.emUsed = true;}}if(emErrs0.length){const err2 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`client.get_chain_id` does not take any parameters"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}const emErrs1 = [];for(const err3 of vErrors){if(!err3.emUsed){emErrs1.push(err3);}}vErrors = emErrs1;errors = emErrs1.length;}validate14$3.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14$2(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(errors > 0){const emErrs0 = [];for(const err1 of vErrors){if(((((err1.keyword !== "errorMessage") && (!err1.emUsed)) && ((err1.instancePath === instancePath) || ((err1.instancePath.indexOf(instancePath) === 0) && (err1.instancePath[instancePath.length] === "/")))) && (err1.schemaPath.indexOf("#") === 0)) && (err1.schemaPath["#".length] === "/")){emErrs0.push(err1);err1.emUsed = true;}}if(emErrs0.length){const err2 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`client.list_keys` does not take any parameters"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}const emErrs1 = [];for(const err3 of vErrors){if(!err3.emUsed){emErrs1.push(err3);}}vErrors = emErrs1;errors = emErrs1.length;}validate14$2.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	const schema16 = {"type":"object","required":["publicKey","transaction","sendingMode"],"additionalProperties":false,"errorMessage":"`client.send_transaction` must only be given `publicKey`, `transaction` and `sendingMode`","properties":{"publicKey":{"type":"string","pattern":"^[0-9a-z]{64}$","errorMessage":"`publicKey` must be a 64 character hex encoded publicKey"},"sendingMode":{"enum":["TYPE_ASYNC",1,"TYPE_SYNC",2,"TYPE_COMMIT",3],"errorMessage":"Only `TYPE_ASYNC` (1), `TYPE_SYNC` (2) and `TYPE_COMMIT` (3) are valid sending modes. The sendingMode must be the string name or numerical enum"},"transaction":{"type":"object","errorMessage":"Unsupported transaction type","oneOf":[{"additionalProperties":false,"required":["orderSubmission"],"properties":{"orderSubmission":{}}},{"additionalProperties":false,"required":["orderCancellation"],"properties":{"orderCancellation":{}}},{"additionalProperties":false,"required":["orderAmendment"],"properties":{"orderAmendment":{}}},{"additionalProperties":false,"required":["withdrawSubmission"],"properties":{"withdrawSubmission":{}}},{"additionalProperties":false,"required":["proposalSubmission"],"properties":{"proposalSubmission":{}}},{"additionalProperties":false,"required":["voteSubmission"],"properties":{"voteSubmission":{}}},{"additionalProperties":false,"required":["liquidityProvisionSubmission"],"properties":{"liquidityProvisionSubmission":{}}},{"additionalProperties":false,"required":["delegateSubmission"],"properties":{"delegateSubmission":{}}},{"additionalProperties":false,"required":["undelegateSubmission"],"properties":{"undelegateSubmission":{}}},{"additionalProperties":false,"required":["liquidityProvisionCancellation"],"properties":{"liquidityProvisionCancellation":{}}},{"additionalProperties":false,"required":["liquidityProvisionAmendment"],"properties":{"liquidityProvisionAmendment":{}}},{"additionalProperties":false,"required":["transfer"],"properties":{"transfer":{}}},{"additionalProperties":false,"required":["cancelTransfer"],"properties":{"cancelTransfer":{}}},{"additionalProperties":false,"required":["announceNode"],"properties":{"announceNode":{}}},{"additionalProperties":false,"required":["batchMarketInstructions"],"properties":{"batchMarketInstructions":{}}},{"additionalProperties":false,"required":["stopOrdersSubmission"],"properties":{"stopOrdersSubmission":{}}},{"additionalProperties":false,"required":["stopOrdersCancellation"],"properties":{"stopOrdersCancellation":{}}},{"additionalProperties":false,"required":["createReferralSet"],"properties":{"createReferralSet":{}}},{"additionalProperties":false,"required":["updateReferralSet"],"properties":{"updateReferralSet":{}}},{"additionalProperties":false,"required":["applyReferralCode"],"properties":{"applyReferralCode":{}}},{"additionalProperties":false,"required":["updateMarginMode"],"properties":{"updateMarginMode":{}}},{"additionalProperties":false,"required":["joinTeam"],"properties":{"joinTeam":{}}},{"additionalProperties":false,"required":["batchProposalSubmission"],"properties":{"batchProposalSubmission":{}}},{"additionalProperties":false,"required":["updatePartyProfile"],"properties":{"updatePartyProfile":{}}},{"additionalProperties":false,"required":["nodeVote"],"properties":{"nodeVote":{}}},{"additionalProperties":false,"required":["nodeSignature"],"properties":{"nodeSignature":{}}},{"additionalProperties":false,"required":["chainEvent"],"properties":{"chainEvent":{}}},{"additionalProperties":false,"required":["keyRotateSubmission"],"properties":{"keyRotateSubmission":{}}},{"additionalProperties":false,"required":["stateVariableProposal"],"properties":{"stateVariableProposal":{}}},{"additionalProperties":false,"required":["validatorHeartbeat"],"properties":{"validatorHeartbeat":{}}},{"additionalProperties":false,"required":["ethereumKeyRotateSubmission"],"properties":{"ethereumKeyRotateSubmission":{}}},{"additionalProperties":false,"required":["protocolUpgradeProposal"],"properties":{"protocolUpgradeProposal":{}}},{"additionalProperties":false,"required":["issueSignatures"],"properties":{"issueSignatures":{}}},{"additionalProperties":false,"required":["oracleDataSubmission"],"properties":{"oracleDataSubmission":{}}}]}}};const pattern0 = new RegExp("^[0-9a-z]{64}$", "u");function validate14$1(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.publicKey === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "publicKey"},message:"must have required property '"+"publicKey"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.transaction === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "transaction"},message:"must have required property '"+"transaction"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}if(data.sendingMode === undefined){const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sendingMode"},message:"must have required property '"+"sendingMode"+"'"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}for(const key0 in data){if(!(((key0 === "publicKey") || (key0 === "sendingMode")) || (key0 === "transaction"))){const err3 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.publicKey !== undefined){let data0 = data.publicKey;if(typeof data0 === "string"){if(!pattern0.test(data0)){const err4 = {instancePath:instancePath+"/publicKey",schemaPath:"#/properties/publicKey/pattern",keyword:"pattern",params:{pattern: "^[0-9a-z]{64}$"},message:"must match pattern \""+"^[0-9a-z]{64}$"+"\""};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}else {const err5 = {instancePath:instancePath+"/publicKey",schemaPath:"#/properties/publicKey/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}if(errors > 0){const emErrs0 = [];for(const err6 of vErrors){if(((((err6.keyword !== "errorMessage") && (!err6.emUsed)) && ((err6.instancePath === instancePath+"/publicKey") || ((err6.instancePath.indexOf(instancePath+"/publicKey") === 0) && (err6.instancePath[instancePath+"/publicKey".length] === "/")))) && (err6.schemaPath.indexOf("#/properties/publicKey") === 0)) && (err6.schemaPath["#/properties/publicKey".length] === "/")){emErrs0.push(err6);err6.emUsed = true;}}if(emErrs0.length){const err7 = {instancePath:instancePath+"/publicKey",schemaPath:"#/properties/publicKey/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`publicKey` must be a 64 character hex encoded publicKey"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}const emErrs1 = [];for(const err8 of vErrors){if(!err8.emUsed){emErrs1.push(err8);}}vErrors = emErrs1;errors = emErrs1.length;}}if(data.sendingMode !== undefined){let data1 = data.sendingMode;if(!((((((data1 === "TYPE_ASYNC") || (data1 === 1)) || (data1 === "TYPE_SYNC")) || (data1 === 2)) || (data1 === "TYPE_COMMIT")) || (data1 === 3))){const err9 = {instancePath:instancePath+"/sendingMode",schemaPath:"#/properties/sendingMode/enum",keyword:"enum",params:{allowedValues: schema16.properties.sendingMode.enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}if(errors > 0){const emErrs2 = [];for(const err10 of vErrors){if(((((err10.keyword !== "errorMessage") && (!err10.emUsed)) && ((err10.instancePath === instancePath+"/sendingMode") || ((err10.instancePath.indexOf(instancePath+"/sendingMode") === 0) && (err10.instancePath[instancePath+"/sendingMode".length] === "/")))) && (err10.schemaPath.indexOf("#/properties/sendingMode") === 0)) && (err10.schemaPath["#/properties/sendingMode".length] === "/")){emErrs2.push(err10);err10.emUsed = true;}}if(emErrs2.length){const err11 = {instancePath:instancePath+"/sendingMode",schemaPath:"#/properties/sendingMode/errorMessage",keyword:"errorMessage",params:{errors: emErrs2},message:"Only `TYPE_ASYNC` (1), `TYPE_SYNC` (2) and `TYPE_COMMIT` (3) are valid sending modes. The sendingMode must be the string name or numerical enum"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}const emErrs3 = [];for(const err12 of vErrors){if(!err12.emUsed){emErrs3.push(err12);}}vErrors = emErrs3;errors = emErrs3.length;}}if(data.transaction !== undefined){let data2 = data.transaction;if(!(data2 && typeof data2 == "object" && !Array.isArray(data2))){const err13 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}const _errs7 = errors;let valid1 = false;let passing0 = null;const _errs8 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.orderSubmission === undefined){const err14 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/0/required",keyword:"required",params:{missingProperty: "orderSubmission"},message:"must have required property '"+"orderSubmission"+"'"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;}for(const key1 in data2){if(!(key1 === "orderSubmission")){const err15 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err15];}else {vErrors.push(err15);}errors++;}}}var _valid0 = _errs8 === errors;if(_valid0){valid1 = true;passing0 = 0;}const _errs10 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.orderCancellation === undefined){const err16 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/1/required",keyword:"required",params:{missingProperty: "orderCancellation"},message:"must have required property '"+"orderCancellation"+"'"};if(vErrors === null){vErrors = [err16];}else {vErrors.push(err16);}errors++;}for(const key2 in data2){if(!(key2 === "orderCancellation")){const err17 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err17];}else {vErrors.push(err17);}errors++;}}}var _valid0 = _errs10 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 1];}else {if(_valid0){valid1 = true;passing0 = 1;}const _errs12 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.orderAmendment === undefined){const err18 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/2/required",keyword:"required",params:{missingProperty: "orderAmendment"},message:"must have required property '"+"orderAmendment"+"'"};if(vErrors === null){vErrors = [err18];}else {vErrors.push(err18);}errors++;}for(const key3 in data2){if(!(key3 === "orderAmendment")){const err19 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err19];}else {vErrors.push(err19);}errors++;}}}var _valid0 = _errs12 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 2];}else {if(_valid0){valid1 = true;passing0 = 2;}const _errs14 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.withdrawSubmission === undefined){const err20 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/3/required",keyword:"required",params:{missingProperty: "withdrawSubmission"},message:"must have required property '"+"withdrawSubmission"+"'"};if(vErrors === null){vErrors = [err20];}else {vErrors.push(err20);}errors++;}for(const key4 in data2){if(!(key4 === "withdrawSubmission")){const err21 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/3/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err21];}else {vErrors.push(err21);}errors++;}}}var _valid0 = _errs14 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 3];}else {if(_valid0){valid1 = true;passing0 = 3;}const _errs16 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.proposalSubmission === undefined){const err22 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/4/required",keyword:"required",params:{missingProperty: "proposalSubmission"},message:"must have required property '"+"proposalSubmission"+"'"};if(vErrors === null){vErrors = [err22];}else {vErrors.push(err22);}errors++;}for(const key5 in data2){if(!(key5 === "proposalSubmission")){const err23 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/4/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err23];}else {vErrors.push(err23);}errors++;}}}var _valid0 = _errs16 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 4];}else {if(_valid0){valid1 = true;passing0 = 4;}const _errs18 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.voteSubmission === undefined){const err24 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/5/required",keyword:"required",params:{missingProperty: "voteSubmission"},message:"must have required property '"+"voteSubmission"+"'"};if(vErrors === null){vErrors = [err24];}else {vErrors.push(err24);}errors++;}for(const key6 in data2){if(!(key6 === "voteSubmission")){const err25 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/5/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err25];}else {vErrors.push(err25);}errors++;}}}var _valid0 = _errs18 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 5];}else {if(_valid0){valid1 = true;passing0 = 5;}const _errs20 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.liquidityProvisionSubmission === undefined){const err26 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/6/required",keyword:"required",params:{missingProperty: "liquidityProvisionSubmission"},message:"must have required property '"+"liquidityProvisionSubmission"+"'"};if(vErrors === null){vErrors = [err26];}else {vErrors.push(err26);}errors++;}for(const key7 in data2){if(!(key7 === "liquidityProvisionSubmission")){const err27 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/6/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err27];}else {vErrors.push(err27);}errors++;}}}var _valid0 = _errs20 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 6];}else {if(_valid0){valid1 = true;passing0 = 6;}const _errs22 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.delegateSubmission === undefined){const err28 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/7/required",keyword:"required",params:{missingProperty: "delegateSubmission"},message:"must have required property '"+"delegateSubmission"+"'"};if(vErrors === null){vErrors = [err28];}else {vErrors.push(err28);}errors++;}for(const key8 in data2){if(!(key8 === "delegateSubmission")){const err29 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/7/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err29];}else {vErrors.push(err29);}errors++;}}}var _valid0 = _errs22 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 7];}else {if(_valid0){valid1 = true;passing0 = 7;}const _errs24 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.undelegateSubmission === undefined){const err30 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/8/required",keyword:"required",params:{missingProperty: "undelegateSubmission"},message:"must have required property '"+"undelegateSubmission"+"'"};if(vErrors === null){vErrors = [err30];}else {vErrors.push(err30);}errors++;}for(const key9 in data2){if(!(key9 === "undelegateSubmission")){const err31 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/8/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err31];}else {vErrors.push(err31);}errors++;}}}var _valid0 = _errs24 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 8];}else {if(_valid0){valid1 = true;passing0 = 8;}const _errs26 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.liquidityProvisionCancellation === undefined){const err32 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/9/required",keyword:"required",params:{missingProperty: "liquidityProvisionCancellation"},message:"must have required property '"+"liquidityProvisionCancellation"+"'"};if(vErrors === null){vErrors = [err32];}else {vErrors.push(err32);}errors++;}for(const key10 in data2){if(!(key10 === "liquidityProvisionCancellation")){const err33 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/9/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err33];}else {vErrors.push(err33);}errors++;}}}var _valid0 = _errs26 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 9];}else {if(_valid0){valid1 = true;passing0 = 9;}const _errs28 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.liquidityProvisionAmendment === undefined){const err34 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/10/required",keyword:"required",params:{missingProperty: "liquidityProvisionAmendment"},message:"must have required property '"+"liquidityProvisionAmendment"+"'"};if(vErrors === null){vErrors = [err34];}else {vErrors.push(err34);}errors++;}for(const key11 in data2){if(!(key11 === "liquidityProvisionAmendment")){const err35 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/10/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err35];}else {vErrors.push(err35);}errors++;}}}var _valid0 = _errs28 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 10];}else {if(_valid0){valid1 = true;passing0 = 10;}const _errs30 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.transfer === undefined){const err36 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/11/required",keyword:"required",params:{missingProperty: "transfer"},message:"must have required property '"+"transfer"+"'"};if(vErrors === null){vErrors = [err36];}else {vErrors.push(err36);}errors++;}for(const key12 in data2){if(!(key12 === "transfer")){const err37 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/11/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err37];}else {vErrors.push(err37);}errors++;}}}var _valid0 = _errs30 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 11];}else {if(_valid0){valid1 = true;passing0 = 11;}const _errs32 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.cancelTransfer === undefined){const err38 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/12/required",keyword:"required",params:{missingProperty: "cancelTransfer"},message:"must have required property '"+"cancelTransfer"+"'"};if(vErrors === null){vErrors = [err38];}else {vErrors.push(err38);}errors++;}for(const key13 in data2){if(!(key13 === "cancelTransfer")){const err39 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/12/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err39];}else {vErrors.push(err39);}errors++;}}}var _valid0 = _errs32 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 12];}else {if(_valid0){valid1 = true;passing0 = 12;}const _errs34 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.announceNode === undefined){const err40 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/13/required",keyword:"required",params:{missingProperty: "announceNode"},message:"must have required property '"+"announceNode"+"'"};if(vErrors === null){vErrors = [err40];}else {vErrors.push(err40);}errors++;}for(const key14 in data2){if(!(key14 === "announceNode")){const err41 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/13/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key14},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err41];}else {vErrors.push(err41);}errors++;}}}var _valid0 = _errs34 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 13];}else {if(_valid0){valid1 = true;passing0 = 13;}const _errs36 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.batchMarketInstructions === undefined){const err42 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/14/required",keyword:"required",params:{missingProperty: "batchMarketInstructions"},message:"must have required property '"+"batchMarketInstructions"+"'"};if(vErrors === null){vErrors = [err42];}else {vErrors.push(err42);}errors++;}for(const key15 in data2){if(!(key15 === "batchMarketInstructions")){const err43 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/14/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key15},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err43];}else {vErrors.push(err43);}errors++;}}}var _valid0 = _errs36 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 14];}else {if(_valid0){valid1 = true;passing0 = 14;}const _errs38 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.stopOrdersSubmission === undefined){const err44 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/15/required",keyword:"required",params:{missingProperty: "stopOrdersSubmission"},message:"must have required property '"+"stopOrdersSubmission"+"'"};if(vErrors === null){vErrors = [err44];}else {vErrors.push(err44);}errors++;}for(const key16 in data2){if(!(key16 === "stopOrdersSubmission")){const err45 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/15/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key16},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err45];}else {vErrors.push(err45);}errors++;}}}var _valid0 = _errs38 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 15];}else {if(_valid0){valid1 = true;passing0 = 15;}const _errs40 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.stopOrdersCancellation === undefined){const err46 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/16/required",keyword:"required",params:{missingProperty: "stopOrdersCancellation"},message:"must have required property '"+"stopOrdersCancellation"+"'"};if(vErrors === null){vErrors = [err46];}else {vErrors.push(err46);}errors++;}for(const key17 in data2){if(!(key17 === "stopOrdersCancellation")){const err47 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/16/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key17},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err47];}else {vErrors.push(err47);}errors++;}}}var _valid0 = _errs40 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 16];}else {if(_valid0){valid1 = true;passing0 = 16;}const _errs42 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.createReferralSet === undefined){const err48 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/17/required",keyword:"required",params:{missingProperty: "createReferralSet"},message:"must have required property '"+"createReferralSet"+"'"};if(vErrors === null){vErrors = [err48];}else {vErrors.push(err48);}errors++;}for(const key18 in data2){if(!(key18 === "createReferralSet")){const err49 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/17/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key18},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err49];}else {vErrors.push(err49);}errors++;}}}var _valid0 = _errs42 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 17];}else {if(_valid0){valid1 = true;passing0 = 17;}const _errs44 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.updateReferralSet === undefined){const err50 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/18/required",keyword:"required",params:{missingProperty: "updateReferralSet"},message:"must have required property '"+"updateReferralSet"+"'"};if(vErrors === null){vErrors = [err50];}else {vErrors.push(err50);}errors++;}for(const key19 in data2){if(!(key19 === "updateReferralSet")){const err51 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/18/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key19},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err51];}else {vErrors.push(err51);}errors++;}}}var _valid0 = _errs44 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 18];}else {if(_valid0){valid1 = true;passing0 = 18;}const _errs46 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.applyReferralCode === undefined){const err52 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/19/required",keyword:"required",params:{missingProperty: "applyReferralCode"},message:"must have required property '"+"applyReferralCode"+"'"};if(vErrors === null){vErrors = [err52];}else {vErrors.push(err52);}errors++;}for(const key20 in data2){if(!(key20 === "applyReferralCode")){const err53 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/19/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key20},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err53];}else {vErrors.push(err53);}errors++;}}}var _valid0 = _errs46 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 19];}else {if(_valid0){valid1 = true;passing0 = 19;}const _errs48 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.updateMarginMode === undefined){const err54 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/20/required",keyword:"required",params:{missingProperty: "updateMarginMode"},message:"must have required property '"+"updateMarginMode"+"'"};if(vErrors === null){vErrors = [err54];}else {vErrors.push(err54);}errors++;}for(const key21 in data2){if(!(key21 === "updateMarginMode")){const err55 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/20/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key21},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err55];}else {vErrors.push(err55);}errors++;}}}var _valid0 = _errs48 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 20];}else {if(_valid0){valid1 = true;passing0 = 20;}const _errs50 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.joinTeam === undefined){const err56 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/21/required",keyword:"required",params:{missingProperty: "joinTeam"},message:"must have required property '"+"joinTeam"+"'"};if(vErrors === null){vErrors = [err56];}else {vErrors.push(err56);}errors++;}for(const key22 in data2){if(!(key22 === "joinTeam")){const err57 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/21/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key22},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err57];}else {vErrors.push(err57);}errors++;}}}var _valid0 = _errs50 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 21];}else {if(_valid0){valid1 = true;passing0 = 21;}const _errs52 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.batchProposalSubmission === undefined){const err58 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/22/required",keyword:"required",params:{missingProperty: "batchProposalSubmission"},message:"must have required property '"+"batchProposalSubmission"+"'"};if(vErrors === null){vErrors = [err58];}else {vErrors.push(err58);}errors++;}for(const key23 in data2){if(!(key23 === "batchProposalSubmission")){const err59 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/22/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key23},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err59];}else {vErrors.push(err59);}errors++;}}}var _valid0 = _errs52 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 22];}else {if(_valid0){valid1 = true;passing0 = 22;}const _errs54 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.updatePartyProfile === undefined){const err60 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/23/required",keyword:"required",params:{missingProperty: "updatePartyProfile"},message:"must have required property '"+"updatePartyProfile"+"'"};if(vErrors === null){vErrors = [err60];}else {vErrors.push(err60);}errors++;}for(const key24 in data2){if(!(key24 === "updatePartyProfile")){const err61 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/23/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key24},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err61];}else {vErrors.push(err61);}errors++;}}}var _valid0 = _errs54 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 23];}else {if(_valid0){valid1 = true;passing0 = 23;}const _errs56 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.nodeVote === undefined){const err62 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/24/required",keyword:"required",params:{missingProperty: "nodeVote"},message:"must have required property '"+"nodeVote"+"'"};if(vErrors === null){vErrors = [err62];}else {vErrors.push(err62);}errors++;}for(const key25 in data2){if(!(key25 === "nodeVote")){const err63 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/24/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key25},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err63];}else {vErrors.push(err63);}errors++;}}}var _valid0 = _errs56 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 24];}else {if(_valid0){valid1 = true;passing0 = 24;}const _errs58 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.nodeSignature === undefined){const err64 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/25/required",keyword:"required",params:{missingProperty: "nodeSignature"},message:"must have required property '"+"nodeSignature"+"'"};if(vErrors === null){vErrors = [err64];}else {vErrors.push(err64);}errors++;}for(const key26 in data2){if(!(key26 === "nodeSignature")){const err65 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/25/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key26},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err65];}else {vErrors.push(err65);}errors++;}}}var _valid0 = _errs58 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 25];}else {if(_valid0){valid1 = true;passing0 = 25;}const _errs60 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.chainEvent === undefined){const err66 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/26/required",keyword:"required",params:{missingProperty: "chainEvent"},message:"must have required property '"+"chainEvent"+"'"};if(vErrors === null){vErrors = [err66];}else {vErrors.push(err66);}errors++;}for(const key27 in data2){if(!(key27 === "chainEvent")){const err67 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/26/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key27},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err67];}else {vErrors.push(err67);}errors++;}}}var _valid0 = _errs60 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 26];}else {if(_valid0){valid1 = true;passing0 = 26;}const _errs62 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.keyRotateSubmission === undefined){const err68 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/27/required",keyword:"required",params:{missingProperty: "keyRotateSubmission"},message:"must have required property '"+"keyRotateSubmission"+"'"};if(vErrors === null){vErrors = [err68];}else {vErrors.push(err68);}errors++;}for(const key28 in data2){if(!(key28 === "keyRotateSubmission")){const err69 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/27/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key28},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err69];}else {vErrors.push(err69);}errors++;}}}var _valid0 = _errs62 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 27];}else {if(_valid0){valid1 = true;passing0 = 27;}const _errs64 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.stateVariableProposal === undefined){const err70 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/28/required",keyword:"required",params:{missingProperty: "stateVariableProposal"},message:"must have required property '"+"stateVariableProposal"+"'"};if(vErrors === null){vErrors = [err70];}else {vErrors.push(err70);}errors++;}for(const key29 in data2){if(!(key29 === "stateVariableProposal")){const err71 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/28/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key29},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err71];}else {vErrors.push(err71);}errors++;}}}var _valid0 = _errs64 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 28];}else {if(_valid0){valid1 = true;passing0 = 28;}const _errs66 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.validatorHeartbeat === undefined){const err72 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/29/required",keyword:"required",params:{missingProperty: "validatorHeartbeat"},message:"must have required property '"+"validatorHeartbeat"+"'"};if(vErrors === null){vErrors = [err72];}else {vErrors.push(err72);}errors++;}for(const key30 in data2){if(!(key30 === "validatorHeartbeat")){const err73 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/29/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key30},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err73];}else {vErrors.push(err73);}errors++;}}}var _valid0 = _errs66 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 29];}else {if(_valid0){valid1 = true;passing0 = 29;}const _errs68 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.ethereumKeyRotateSubmission === undefined){const err74 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/30/required",keyword:"required",params:{missingProperty: "ethereumKeyRotateSubmission"},message:"must have required property '"+"ethereumKeyRotateSubmission"+"'"};if(vErrors === null){vErrors = [err74];}else {vErrors.push(err74);}errors++;}for(const key31 in data2){if(!(key31 === "ethereumKeyRotateSubmission")){const err75 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/30/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key31},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err75];}else {vErrors.push(err75);}errors++;}}}var _valid0 = _errs68 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 30];}else {if(_valid0){valid1 = true;passing0 = 30;}const _errs70 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.protocolUpgradeProposal === undefined){const err76 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/31/required",keyword:"required",params:{missingProperty: "protocolUpgradeProposal"},message:"must have required property '"+"protocolUpgradeProposal"+"'"};if(vErrors === null){vErrors = [err76];}else {vErrors.push(err76);}errors++;}for(const key32 in data2){if(!(key32 === "protocolUpgradeProposal")){const err77 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/31/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key32},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err77];}else {vErrors.push(err77);}errors++;}}}var _valid0 = _errs70 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 31];}else {if(_valid0){valid1 = true;passing0 = 31;}const _errs72 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.issueSignatures === undefined){const err78 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/32/required",keyword:"required",params:{missingProperty: "issueSignatures"},message:"must have required property '"+"issueSignatures"+"'"};if(vErrors === null){vErrors = [err78];}else {vErrors.push(err78);}errors++;}for(const key33 in data2){if(!(key33 === "issueSignatures")){const err79 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/32/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key33},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err79];}else {vErrors.push(err79);}errors++;}}}var _valid0 = _errs72 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 32];}else {if(_valid0){valid1 = true;passing0 = 32;}const _errs74 = errors;if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.oracleDataSubmission === undefined){const err80 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/33/required",keyword:"required",params:{missingProperty: "oracleDataSubmission"},message:"must have required property '"+"oracleDataSubmission"+"'"};if(vErrors === null){vErrors = [err80];}else {vErrors.push(err80);}errors++;}for(const key34 in data2){if(!(key34 === "oracleDataSubmission")){const err81 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf/33/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key34},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err81];}else {vErrors.push(err81);}errors++;}}}var _valid0 = _errs74 === errors;if(_valid0 && valid1){valid1 = false;passing0 = [passing0, 33];}else {if(_valid0){valid1 = true;passing0 = 33;}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}if(!valid1){const err82 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};if(vErrors === null){vErrors = [err82];}else {vErrors.push(err82);}errors++;}else {errors = _errs7;if(vErrors !== null){if(_errs7){vErrors.length = _errs7;}else {vErrors = null;}}}if(errors > 0){const emErrs4 = [];for(const err83 of vErrors){if(((((err83.keyword !== "errorMessage") && (!err83.emUsed)) && ((err83.instancePath === instancePath+"/transaction") || ((err83.instancePath.indexOf(instancePath+"/transaction") === 0) && (err83.instancePath[instancePath+"/transaction".length] === "/")))) && (err83.schemaPath.indexOf("#/properties/transaction") === 0)) && (err83.schemaPath["#/properties/transaction".length] === "/")){emErrs4.push(err83);err83.emUsed = true;}}if(emErrs4.length){const err84 = {instancePath:instancePath+"/transaction",schemaPath:"#/properties/transaction/errorMessage",keyword:"errorMessage",params:{errors: emErrs4},message:"Unsupported transaction type"};if(vErrors === null){vErrors = [err84];}else {vErrors.push(err84);}errors++;}const emErrs5 = [];for(const err85 of vErrors){if(!err85.emUsed){emErrs5.push(err85);}}vErrors = emErrs5;errors = emErrs5.length;}}}else {const err86 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err86];}else {vErrors.push(err86);}errors++;}if(errors > 0){const emErrs6 = [];for(const err87 of vErrors){if(((((err87.keyword !== "errorMessage") && (!err87.emUsed)) && ((err87.instancePath === instancePath) || ((err87.instancePath.indexOf(instancePath) === 0) && (err87.instancePath[instancePath.length] === "/")))) && (err87.schemaPath.indexOf("#") === 0)) && (err87.schemaPath["#".length] === "/")){emErrs6.push(err87);err87.emUsed = true;}}if(emErrs6.length){const err88 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs6},message:"`client.send_transaction` must only be given `publicKey`, `transaction` and `sendingMode`"};if(vErrors === null){vErrors = [err88];}else {vErrors.push(err88);}errors++;}const emErrs7 = [];for(const err89 of vErrors){if(!err89.emUsed){emErrs7.push(err89);}}vErrors = emErrs7;errors = emErrs7.length;}validate14$1.errors = vErrors;return errors === 0;}

	/* eslint-disable */
	/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
	function validate14(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(errors > 0){const emErrs0 = [];for(const err1 of vErrors){if(((((err1.keyword !== "errorMessage") && (!err1.emUsed)) && ((err1.instancePath === instancePath) || ((err1.instancePath.indexOf(instancePath) === 0) && (err1.instancePath[instancePath.length] === "/")))) && (err1.schemaPath.indexOf("#") === 0)) && (err1.schemaPath["#".length] === "/")){emErrs0.push(err1);err1.emUsed = true;}}if(emErrs0.length){const err2 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`client.is_connected` does not take any parameters"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}const emErrs1 = [];for(const err3 of vErrors){if(!err3.emUsed){emErrs1.push(err3);}}vErrors = emErrs1;errors = emErrs1.length;}validate14.errors = vErrors;return errors === 0;}

	const Errors = {
	  NOT_CONNECTED: ['Not connected', -1, 'You must connect to the wallet before further interaction'],
	  CONNECTION_DENIED: ['Connection denied', -2, 'The user denied the connection request'],

	  UNKNOWN_PUBLIC_KEY: ['Unknown public key', -3, 'The public key is not known to the wallet'],
	  TRANSACTION_DENIED: ['Transaction denied', -4, 'The user denied the transaction request'],

	  TRANSACTION_FAILED: ['Transaction failed', -5 /* This is filled in by the error thrown */],

	  MISMATCHING_CHAIN_ID: [
	    'Mismatching chain ID',
	    -6,
	    'The chain ID does not match the connected chain ID, please remove the connection from the wallet and connect again'
	  ],

	  UNKNOWN_CHAIN_ID: [
	    'Unknown chain ID',
	    -7,
	    'The chain ID is not known to the wallet, please review the chain ID and try again'
	  ]
	};

	function doValidate(validator, params) {
	  if (!validator(params))
	    throw new JSONRPCServer.Error(
	      validator.errors[0].message,
	      1,
	      validator.errors.map((e) => e.message)
	    )
	}
	function init({ onerror, settings, wallets, networks, connections, interactor }) {
	  return new JSONRPCServer({
	    onerror,
	    methods: {
	      async 'client.connect_wallet'(params, context) {
	        const receivedAt = new Date().toISOString();
	        doValidate(validate14$5, params);
	        if (context.isConnected === true) {
	          if (!params.chainId) return null
	          if (params.chainId && params.chainId === (await connections.getChainId(context.origin))) return null
	        }
	        if ((await connections.has(context.origin)) === false) {
	          // If this is a connection request, without a chainId we look up the default one for the extension
	          if (params.chainId == null) {
	            const selectedNetworkId = await settings.get('selectedNetwork');
	            params.chainId = (await networks.getByNetworkId(selectedNetworkId)).chainId;
	          }
	          const network = await networks.getByChainId(params.chainId);
	          if (network == null) {
	            throw new JSONRPCServer.Error(...Errors.UNKNOWN_CHAIN_ID)
	          }
	          const hiddenNetworksEnabled = await settings.get('showHiddenNetworks');
	          if (network.hidden && hiddenNetworksEnabled !== true) {
	            throw new JSONRPCServer.Error(...Errors.UNKNOWN_CHAIN_ID)
	          }

	          const reply = await interactor.reviewConnection({
	            origin: context.origin,
	            chainId: params.chainId,
	            receivedAt
	          });
	          if (reply.approved === false) throw new JSONRPCServer.Error(...Errors.CONNECTION_DENIED)
	          const allWallets = await wallets.list();
	          const walletPubKeys = await Promise.all(allWallets.map((w) => wallets.listKeys({ wallet: w })));
	          await connections.set(context.origin, {
	            // TODO: Allow all wallets and keys for now
	            allowList: { wallets: allWallets, publicKeys: walletPubKeys.flatMap((w) => w) },
	            chainId: params.chainId,
	            networkId: reply.networkId
	          });
	        } else if (params.chainId != null && (await connections.getChainId(context.origin)) !== params.chainId) {
	          throw new JSONRPCServer.Error(...Errors.MISMATCHING_CHAIN_ID)
	        }

	        context.isConnected = true;

	        return null
	      },
	      async 'client.disconnect_wallet'(params, context) {
	        doValidate(validate14$4, params);
	        // context.isConnected = false

	        return null
	      },
	      async 'client.is_connected'(params, context) {
	        doValidate(validate14, params);

	        return context.isConnected === true
	      },
	      async 'client.send_transaction'(params, context) {
	        const receivedAt = new Date().toISOString();
	        doValidate(validate14$1, params);
	        if (context.isConnected !== true) throw new JSONRPCServer.Error(...Errors.NOT_CONNECTED)
	        if ((await connections.isAllowed(context.origin, params.publicKey)) === false) {
	          throw new JSONRPCServer.Error(...Errors.UNKNOWN_PUBLIC_KEY)
	        }

	        const keyInfo = await wallets.getKeyInfo({
	          publicKey: params.publicKey
	        });

	        if (keyInfo == null) throw new JSONRPCServer.Error(...Errors.UNKNOWN_PUBLIC_KEY)

	        const approved = await interactor.reviewTransaction({
	          transaction: params.transaction,
	          publicKey: params.publicKey,
	          name: keyInfo.name,
	          wallet: keyInfo.wallet,
	          sendingMode: params.sendingMode,
	          origin: context.origin,
	          chainId: await connections.getChainId(context.origin),
	          networkId: await connections.getNetworkId(context.origin),
	          receivedAt
	        });

	        if (approved === false) throw new JSONRPCServer.Error(...Errors.TRANSACTION_DENIED)

	        const key = await wallets.getKeypair({ publicKey: params.publicKey });

	        const selectedNetworkId = await connections.getNetworkId(context.origin);
	        const selectedChainId = await connections.getChainId(context.origin);
	        const network = await networks.get(selectedNetworkId, selectedChainId);

	        const rpc = await network.rpc();

	        try {
	          const res = await sendTransaction({
	            keys: key.keyPair,
	            rpc,
	            sendingMode: params.sendingMode,
	            transaction: params.transaction
	          });

	          res.receivedAt = receivedAt;

	          return res
	        } catch (e) {
	          if (NodeRPC.isTxError(e)) {
	            throw new JSONRPCServer.Error(...Errors.TRANSACTION_FAILED, {
	              message: e.message,
	              code: e.code
	            })
	          }

	          throw e
	        }
	      },
	      async 'client.sign_transaction'(params, context) {
	        throw new JSONRPCServer.Error('Not Implemented', -32601)
	      },
	      async 'client.get_chain_id'(params, context) {
	        doValidate(validate14$3, params);

	        if (context.isConnected === true) {
	          const selectedNetworkId = await connections.getNetworkId(context.origin);
	          const selectedChainId = await connections.getChainId(context.origin);
	          const network = await networks.get(selectedNetworkId, selectedChainId);

	          return { chainID: network.chainId }
	        }

	        const selectedNetworkId = await settings.get('selectedNetwork');
	        const network = await networks.getByNetworkId(selectedNetworkId);

	        return { chainID: network.chainId }
	      },

	      async 'client.list_keys'(params, context) {
	        doValidate(validate14$2, params);
	        if (context.isConnected !== true) throw new JSONRPCServer.Error(...Errors.NOT_CONNECTED)

	        const keys = await connections.listAllowedKeys(context.origin);

	        return { keys }
	      }
	    }
	  })
	}

	// import { captureException } from '@sentry/browser'
	// import { setupSentry } from './lib/sentry.js'

	const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime;
	const action = globalThis.browser?.browserAction ?? globalThis.chrome?.action;

	const interactor = new PopupClient({
	  onbeforerequest: setPending,
	  onafterrequest: setPending
	});

	const encryptedStore = new EncryptedStorage(
	  new ConcurrentStorage(new StorageLocalMap('wallets')),
	  testnet.encryptionSettings
	);

	const publicKeyIndexStore = new ConcurrentStorage(new StorageLocalMap('public-key-index'));

	const settings = new ConcurrentStorage(new StorageLocalMap('settings'));
	const wallets = new WalletCollection({
	  walletsStore: encryptedStore,
	  publicKeyIndexStore
	});
	const networks = new NetworkCollection(new ConcurrentStorage(new StorageLocalMap('networks')));
	const connections = new ConnectionsCollection({
	  connectionsStore: new ConcurrentStorage(new StorageLocalMap('connections')),
	  publicKeyIndexStore
	});

	const fetchCache = new FetchCache(new StorageSessionMap('fetch-cache'));

	// setupSentry(settings, wallets)

	const onerror = (...args) => {
	  console.error(args);
	  // captureException(args[0])
	};

	const clientServer = init({
	  settings,
	  wallets,
	  networks,
	  connections,
	  interactor,
	  onerror
	});

	const clientPorts = new PortServer({
	  onerror,
	  onconnect: async (context) => {
	    // Auto connect if origin is already approved (what we internally call connected)
	    context.isConnected = await connections.has(context.origin);
	    await connections.touch(context.origin);
	  },
	  server: clientServer
	});

	const server = init$1({
	  encryptedStore,
	  settings,
	  wallets,
	  networks,
	  connections,
	  fetchCache,
	  onerror
	});

	const popupPorts = new PortServer({
	  server,
	  onerror
	});

	connections.on('delete', ({ origin }) => {
	  clientPorts.broadcast(origin, {
	    jsonrpc: '2.0',
	    method: 'client.disconnected',
	    params: null
	  });
	  // TODO @emil to review as this doesn't seem like the correct place to do this
	  for (const [, context] of clientPorts.ports.entries()) {
	    if (context.origin === origin || context.origin === '*') {
	      context.isConnected = false;
	    }
	  }
	});

	setupListeners(runtime, networks, settings, clientPorts, popupPorts, interactor, connections);

	async function setPending() {
	  const pending = interactor.totalPending();

	  // Early return as there is not much else to do
	  if (pending === 0) {
	    action.setBadgeText({ text: '' });
	    return
	  }

	  try {
	    if (pending > 0 && popupPorts.ports.size < 1 && (await settings.get('autoOpen'))) {
	      await createNotificationWindow();
	    }
	  } catch (_) {}

	  action.setBadgeText({
	    text: pending.toString()
	  });
	}

})();
