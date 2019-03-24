<?php

namespace Tests\Feature\Api;

use App\User;

class UsersTest extends BaseTest
{
    /** @test */
    public function a_user_can_list_users()
    {
        $payload = array_merge($this->getDefaultPayload(), []);

        $this->get(route('api.users.index'), $payload)->assertStatus(200);
    }

    /** @test */
    public function a_user_can_create_a_user()
    {
        // A test data that will be used by the API to create a user.
        $attributes = [
            'type' => $this->faker->randomElements(['superuser', 'user'])[0],
            'firstname' => $this->faker->firstName,
            'lastname' => $this->faker->lastName,
            'email' => $this->faker->email,
        ];

        $payload = array_merge($this->getDefaultPayload(), []);

        // Assuming that the user is created through the test data,
        // It must return a 201 response status and then,
        // It must return a response body consisting our test data, if not all.
        $this->post(route('api.users.store'), array_merge($attributes, $payload))
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
        $this->get(route('api.users.show', $user), $payload)
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
        $this->delete(route('api.users.destroy', $user))
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
        $this->patch(route('api.users.restore', $recoverableUser))
            ->assertStatus(200)
            ->assertJsonFragment([
                'total' => $incremented
            ]);
    }
}
