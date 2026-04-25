<?php
use PHPUnit\Framework\TestCase;
use App\Encryptor;

class EncryptorTest extends TestCase
{
    public function testIsValid()
    {
        $this->assertTrue(Encryptor::isValid('sha256'));
        $this->assertTrue(Encryptor::isValid('bcrypt'));
        $this->assertFalse(Encryptor::isValid('invalid_method'));
    }

    public function testMd5Encryption()
    {
        $plain = 'testpassword';
        $hashed = Encryptor::encrypt($plain, 'md5');
        $this->assertEquals(md5($plain), $hashed);
    }

    public function testSha256Encryption()
    {
        $plain = 'testpassword';
        $hashed = Encryptor::encrypt($plain, 'sha256');
        $this->assertEquals(hash('sha256', $plain), $hashed);
    }

    public function testBcryptEncryption()
    {
        $plain = 'testpassword';
        $hashed = Encryptor::encrypt($plain, 'bcrypt');
        $this->assertTrue(password_verify($plain, $hashed));
    }
}
