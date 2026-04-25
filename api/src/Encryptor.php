<?php
namespace App;

class Encryptor
{
    const SUPPORTED_METHODS = ['md5', 'sha256', 'aes256', 'bcrypt', 'argon2id'];

    /**
     * Hash/encrypt a plain text password.
     *
     * @param string $plain   The plain text password
     * @param string $method  md5 | sha256 | aes256 | bcrypt | argon2id
     * @param string $aesKey  Key used for AES-256 (required only for aes256)
     * @return string
     * @throws \Exception
     */
    public static function encrypt(string $plain, string $method, string $aesKey = ''): string
    {
        switch (strtolower($method)) {
            case 'md5':
                return md5($plain);

            case 'sha256':
                return hash('sha256', $plain);

            case 'aes256':
                return self::encryptAES256($plain, $aesKey);

            case 'bcrypt':
                return password_hash($plain, PASSWORD_BCRYPT);

            case 'argon2id':
                if (!defined('PASSWORD_ARGON2ID')) {
                    throw new \RuntimeException('Argon2id is not supported in this PHP installation.');
                }
                return password_hash($plain, PASSWORD_ARGON2ID);

            default:
                throw new \InvalidArgumentException("Unsupported encryption method: $method");
        }
    }

    /**
     * AES-256-CBC encryption.
     * Returns base64( IV + encrypted_data ) so the IV is stored alongside the ciphertext.
     *
     * @param string $plain  Plain text
     * @param string $key    Secret key (will be padded/hashed to 32 bytes)
     * @return string        Base64-encoded string: "iv_hex:ciphertext_base64"
     * @throws \Exception
     */
    private static function encryptAES256(string $plain, string $key): string
    {
        if (empty($key)) {
            throw new \InvalidArgumentException('AES key must not be empty when using AES-256.');
        }

        $derivedKey = hash('sha256', $key, true);

        $iv = random_bytes(16);

        $encrypted = openssl_encrypt(
            $plain,
            'AES-256-CBC',
            $derivedKey,
            OPENSSL_RAW_DATA,
            $iv
        );

        if ($encrypted === false) {
            throw new \RuntimeException('AES-256 encryption failed.');
        }

        return bin2hex($iv) . ':' . base64_encode($encrypted);
    }

    /**
     * Validate that the selected method is supported.
     */
    public static function isValid(string $method): bool
    {
        return in_array(strtolower($method), self::SUPPORTED_METHODS, true);
    }
}
