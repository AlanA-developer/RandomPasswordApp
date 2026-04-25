<?php
use PHPUnit\Framework\TestCase;
use App\PasswordGenerator;

class PasswordGeneratorTest extends TestCase
{
    public function testGenerateLength()
    {
        $password = PasswordGenerator::generate(16, 'alphanumeric');
        $this->assertEquals(16, strlen($password));
    }

    public function testGenerateExcludeAmbiguous()
    {
        $password = PasswordGenerator::generate(100, 'alphanumeric', true, false);
        $this->assertFalse(str_contains($password, '0'));
        $this->assertFalse(str_contains($password, 'O'));
        $this->assertFalse(str_contains($password, 'l'));
        $this->assertFalse(str_contains($password, '1'));
        $this->assertFalse(str_contains($password, 'I'));
    }

    public function testGenerateStrictRules()
    {
        $password = PasswordGenerator::generate(12, 'alphanumeric', false, true);
        $this->assertTrue((bool)preg_match('/\d/', $password));
        $this->assertTrue((bool)preg_match('/[A-Z]/', $password));
        $this->assertTrue((bool)preg_match('/[a-z]/', $password));
    }
}
