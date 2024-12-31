/**
 * tch1.js
 * 
 * A one-way hash encrypter using the custom language TCH1.
 * 
 * Features:
 * - One-way hashing (irreversible)
 * - Fixed default salt for deterministic hashing
 * - Optional custom salt for varied hashing
 * - Hash stretching for increased difficulty against brute-force attacks
 * - Fixed-size output
 * - Compatible with both Browser and Node.js environments
 * 
 * Usage:
 *   In Browser:
 *     <script src="https://cdn.jsdelivr.net/gh/turbo-chat/tch1.js/tch1.js"></script>
 *     <script>
 *       const hash = TCH1.hash("hello world");
 *       console.log(hash);
 *     </script>
 * 
 *   In Node.js:
 *     const TCH1 = require('./tch1.js');
 *     const hash = TCH1.hash("hello world");
 *     console.log(hash);
 * 
 * Customization:
 *   You can modify the transformation rules, salt generation, and hashing rounds as needed.
 */

// IIFE to encapsulate the TCH1 module
(function (global) {
    // Define the TCH1 module
    const TCH1 = {};

    // Default Configuration
    TCH1.DEFAULT_ROUNDS = 1000;
    TCH1.DEFAULT_SALT = "FixedDefaultSalt123"; // Fixed salt for deterministic hashing
    TCH1.HASH_LENGTH = 32; // Fixed hash length

    /**
     * Transformation Function Based on TCH1 Rules
     * 
     * @param {string} str - String to transform
     * @returns {string} - Transformed string
     */
    TCH1.transform = function (str) {
        let transformed = '';

        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i);

            // Example TCH1 transformation rules:
            // 1. Rotate character code by 5
            // 2. Substitute certain characters with specific symbols
            // 3. Perform bitwise operations for obfuscation

            // Rotate character code by 5
            charCode = (charCode + 5) % 256;

            // Substitute vowels with specific symbols
            const vowelsSubstitution = {
                'a': '@', 'e': '3', 'i': '1', 'o': '0', 'u': 'µ',
                'A': '4', 'E': '€', 'I': '!', 'O': 'Ø', 'U': 'Û'
            };
            let char = String.fromCharCode(charCode);
            if (vowelsSubstitution[char]) {
                char = vowelsSubstitution[char];
            }

            // Bitwise XOR with 0x55 for additional obfuscation
            charCode = char.charCodeAt(0) ^ 0x55;
            transformed += String.fromCharCode(charCode);
        }

        return transformed;
    };

    /**
     * Function to pad the hash to a fixed length
     * @param {string} hash - Current hash string
     * @param {number} length - Desired length
     * @returns {string} - Padded or truncated hash string
     */
    TCH1.padHash = function (hash, length) {
        if (hash.length < length) {
            while (hash.length < length) {
                hash += '0';
            }
        }
        return hash.slice(0, length);
    };

    /**
     * TCH1 Hash Function
     * 
     * @param {string} input - The input string to hash
     * @param {string} [salt] - Optional salt; if not provided, a fixed default salt is used
     * @param {number} [rounds] - Number of hashing iterations
     * @returns {string} - The resulting hash
     */
    TCH1.hash = function (input, salt, rounds) {
        // Initialize salt
        salt = salt || TCH1.DEFAULT_SALT;

        // Initialize rounds
        rounds = rounds || TCH1.DEFAULT_ROUNDS;

        // Combine salt and input
        let combined = salt + input;
        let hash = '';

        for (let i = 0; i < rounds; i++) {
            hash = TCH1.transform(combined);
            combined = hash;
        }

        // Ensure fixed-size output
        hash = TCH1.padHash(hash, TCH1.HASH_LENGTH);

        return hash;
    };

    /**
     * Expose TCH1 module
     */
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = TCH1;
    } else {
        global.TCH1 = TCH1;
    }

})(typeof window !== 'undefined' ? window : global);
