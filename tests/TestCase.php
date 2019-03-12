<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Preliminary actions here are executed before a test runs.
     *
     * @return void
     */
    public function setUp() : void
    {
        parent::setUp();

        // This will show all caught exceptions.
        $this->withoutExceptionHandling();

        $this->artisan('db:seed');
    }
}
