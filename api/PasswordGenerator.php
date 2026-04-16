<?php

class PasswordGenerator
{
    private const NUMBERS  = '0123456789';
    private const LETTERS  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private const SYMBOLS  = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    /**
     * Generate a single random password.
     *
     * @param int    $length  Password length (min 4)
     * @param string $type    numbers | letters | alphanumeric | alphanumeric_symbols
     * @return string
     * @throws Exception
     */
    public static function generate(int $length, string $type): string
    {
        $charset = self::getCharset($type);
        $charsetLen = strlen($charset);

        if ($charsetLen === 0) {
            throw new \InvalidArgumentException("Invalid password type: $type");
        }

        $password = '';
        $randomBytes = random_bytes($length * 2);

        for ($i = 0; $i < $length; $i++) {
            $index = ord($randomBytes[$i]) % $charsetLen;
            $password .= $charset[$index];
        }

        return $password;
    }

    /**
     * Generate N passwords.
     *
     * @param int    $quantity  Number of passwords
     * @param int    $length    Password length
     * @param string $type      Password character type
     * @return string[]
     */
    public static function generateBatch(int $quantity, int $length, string $type): array
    {
        $passwords = [];
        for ($i = 0; $i < $quantity; $i++) {
            $passwords[] = self::generate($length, $type);
        }
        return $passwords;
    }

    /**
     * Build the character set based on type.
     */
    private static function getCharset(string $type): string
    {
        switch ($type) {
            case 'numbers':
                return self::NUMBERS;
            case 'letters':
                return self::LETTERS;
            case 'alphanumeric':
                return self::NUMBERS . self::LETTERS;
            case 'alphanumeric_symbols':
                return self::NUMBERS . self::LETTERS . self::SYMBOLS;
            default:
                return self::NUMBERS . self::LETTERS;
        }
    }
}
