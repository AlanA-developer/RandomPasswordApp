<?php
namespace App;

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
     * @param bool   $excludeAmbiguous
     * @param bool   $strictRules
     * @return string
     * @throws \Exception
     */
    public static function generate(int $length, string $type, bool $excludeAmbiguous = false, bool $strictRules = false, string $customSymbols = ''): string
    {
        if ($type === 'passphrase') {
            return self::generatePassphrase($length);
        }

        $charset = self::getCharset($type, $customSymbols);
        
        if ($excludeAmbiguous) {
            $charset = str_replace(['0', 'O', 'l', '1', 'I'], '', $charset);
        }

        $charsetLen = strlen($charset);

        if ($charsetLen === 0) {
            throw new \InvalidArgumentException("Invalid password type or empty charset.");
        }

        $maxAttempts = 50;
        $attempt = 0;

        do {
            $password = '';
            $randomBytes = random_bytes($length * 2);

            for ($i = 0; $i < $length; $i++) {
                $index = ord($randomBytes[$i]) % $charsetLen;
                $password .= $charset[$index];
            }

            if (!$strictRules) {
                return $password;
            }

            $hasNumber = preg_match('/\d/', $password);
            $hasUpper  = preg_match('/[A-Z]/', $password);
            $hasLower  = preg_match('/[a-z]/', $password);
            $hasSymbol = preg_match('/[!@#$%^&*()\-_=+\[\]{}|;:,.<>?]/', $password);

            $meetsStrict = true;

            if ($type === 'alphanumeric' && (!$hasNumber || !$hasUpper || !$hasLower)) {
                $meetsStrict = false;
            } elseif ($type === 'alphanumeric_symbols' && (!$hasNumber || !$hasUpper || !$hasLower || !$hasSymbol)) {
                $meetsStrict = false;
            } elseif ($type === 'letters' && (!$hasUpper || !$hasLower)) {
                $meetsStrict = false;
            }

            if ($meetsStrict) {
                return $password;
            }

            $attempt++;
        } while ($attempt < $maxAttempts);

        return $password;
    }

    /**
     * Generate N passwords.
     *
     * @param int    $quantity  Number of passwords
     * @param int    $length    Password length
     * @param string $type      Password character type
     * @param bool   $excludeAmbiguous
     * @param bool   $strictRules
     * @return string[]
     */
    public static function generateBatch(int $quantity, int $length, string $type, bool $excludeAmbiguous = false, bool $strictRules = false, string $customSymbols = ''): array
    {
        $passwords = [];
        for ($i = 0; $i < $quantity; $i++) {
            $passwords[] = self::generate($length, $type, $excludeAmbiguous, $strictRules, $customSymbols);
        }
        return $passwords;
    }

    /**
     * Build the character set based on type.
     */
    private static function getCharset(string $type, string $customSymbols = ''): string
    {
        $symbols = $customSymbols !== '' ? $customSymbols : self::SYMBOLS;
        switch ($type) {
            case 'numbers':
                return self::NUMBERS;
            case 'letters':
                return self::LETTERS;
            case 'alphanumeric':
                return self::NUMBERS . self::LETTERS;
            case 'alphanumeric_symbols':
                return self::NUMBERS . self::LETTERS . $symbols;
            default:
                return self::NUMBERS . self::LETTERS;
        }
    }

    private static function generatePassphrase(int $length): string
    {
        $words = include __DIR__ . '/wordlist.php';
        $totalWords = count($words);
        if ($totalWords === 0) return 'error-empty-wordlist';
        
        $passphraseParts = [];
        $wordsCount = max(3, min(10, $length)); // Consider length as word count for passphrases
        
        for ($i = 0; $i < $wordsCount; $i++) {
            $randomInt = random_int(0, $totalWords - 1);
            $passphraseParts[] = $words[$randomInt];
        }
        
        return implode('-', $passphraseParts);
    }
}
