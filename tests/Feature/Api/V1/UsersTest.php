<?php

namespace Tests\Feature\Api\V1;

use App\User;

class UsersTest extends BaseTest
{
    /** @test */
    public function a_user_can_list_users()
    {
        $payload = array_merge($this->getDefaultPayload(), []);

        $this->get(route('api.v1.users.index'), $payload)->assertStatus(200);
    }

    /** @test */
    public function a_user_can_create_a_user()
    {
        // A test data that will be used by the API to create a user.
        $attributes = [
            'type' => $this->faker->randomElements(['superuser', 'user'])[0],
            'firstname' => $this->faker->firstName,
            'middlename' => $this->faker->lastName,
            'lastname' => $this->faker->lastName,

            'gender' => $this->faker->randomElements(['female', 'male'])[0],
            'birthdate' => now()->subYears(mt_rand(10, 50))->format('Y-m-d'),
            'address' => $this->faker->address,

            'email' => $this->faker->email,
            'username' => $this->faker->userName,
        ];

        $payload = array_merge($this->getDefaultPayload(), []);

        // Assuming that the user is created through the test data,
        // It must return a 201 response status and then,
        // It must return a response body consisting our test data, if not all.
        $this->post(route('api.v1.users.store'), array_merge($attributes, $payload))
            ->assertStatus(201)
            ->assertJson($attributes);

        // Assert against the database that the test data's email property is
        // found in one of the records in the database.
        $this->assertDatabaseHas('users', [
            'email' => $attributes['email']
        ]);
    }

    /** @test */
    public function a_user_can_view_a_user()
    {
        $payload = array_merge($this->getDefaultPayload(), []);

        // The user to be shown.
        $user = User::first();

        // Assuming that a user is found,
        // It must return a 200 response status and then,
        // It must be found as is in the JSON response.
        $this->get(route('api.v1.users.show', $user), $payload)
            ->assertStatus(200)
            ->assertExactJson($user->toArray());
    }

    /** @test */
    public function a_user_can_delete_a_user()
    {
        $payload = array_merge($this->getDefaultPayload(), []);

        // The user to be deleted.
        $user = User::latest()->first();

        // Decremented counter.
        $decremented =  User::count() - 1;

        // Assuming that the API will delete one,
        // It must return a 200 response status and then,
        // It must equal this decremented counter.
        $this->delete(route('api.v1.users.destroy', $user))
            ->assertStatus(200)
            ->assertJsonFragment([
                'total' => $decremented
            ]);
    }

    /** @test */
    public function a_user_can_restore_a_user()
    {
        $payload = array_merge($this->getDefaultPayload(), []);

        // Delete a user, it will then be restored.
        $deletedUser = User::latest()->first();
        $deletedUser->delete();

        // Incremented counter
        $incremented =  User::count() + 1;

        // Get the deleted user.
        $recoverableUser = User::withTrashed()->find($deletedUser->id);

        // Assuming that the users count is decremented after deleting one,
        // It must return a 200 response status and then,
        // It must equal this incremented counter.
        $this->patch(route('api.v1.users.restore', $recoverableUser))
            ->assertStatus(200)
            ->assertJsonFragment([
                'total' => $incremented
            ]);
    }

    /** @test */
    public function a_user_can_store_a_user_avatar()
    {
        $user = User::first();

        $payload = array_merge($this->getDefaultPayload(), [
            'user' => $user
        ]);

        $this->post(route('api.v1.users.avatar.store', $payload))
            ->assertStatus(200);
    }
}
