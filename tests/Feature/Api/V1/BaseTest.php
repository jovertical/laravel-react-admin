<?php

namespace Tests\Feature\Api\V1;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class BaseTest extends TestCase
{
    use WithFaker, RefreshDatabase;

    /**
     * Get default request payload
     *
     * @return array
     */
    protected function getDefaultPayload()
    {
        return [
            'auth_token' => _test_user()->auth_token,
        ];
    }
}
