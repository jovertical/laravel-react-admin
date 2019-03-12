<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UsersTest extends TestCase
{
    use WithFaker, DatabaseTransactions;

    /** @test */
    public function a_user_can_list_users()
    {
        $payload = array_merge($this->getDefaultPayload(), []);

        $this->get(route('api.users.index'), $payload)->assertStatus(200);
    }

    /** @test */
    public function a_user_can_create_a_user()
    {
        $attributes = [
            'type' => $this->faker->randomElements(['superuser', 'user'])[0],
            'firstname' => $this->faker->firstName,
            'lastname' => $this->faker->lastName,
            'email' => $this->faker->email,
        ];

        $payload = array_merge($this->getDefaultPayload(), []);

        $this->post(route('api.users.store'), array_merge($attributes, $payload))
            ->assertStatus(201)
            ->assertJson($attributes);

        $this->assertDatabaseHas('users', [
            'email' => $attributes['email']
        ]);
    }

    /** @test */
    public function a_user_can_view_a_user()
    {
        $payload = array_merge($this->getDefaultPayload(), []);
        $user = User::first();

        $this->get(route('api.users.show', $user), $payload)
            ->assertStatus(200)
            ->assertJson($user->toArray());
    }

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
