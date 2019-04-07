<?php

namespace Tests\Feature\Api\V1;

use App\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\TestResponse;

class UsersTest extends BaseTest
{
    /** @test */
    public function a_user_can_list_users()
    {
        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), []);

        $this->get(route('api.v1.users.index'), $body)->assertStatus(200);
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

        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), []);

        // Assuming that the user is created through the test data,
        // It must return a 201 response status and then,
        // It must return a response body consisting our test data, if not all.
        $this->post(route('api.v1.users.store'), array_merge($attributes, $body))
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
        // The user to be shown.
        $user = User::first();

        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), []);

        // Assuming that a user is found,
        // It must return a 200 response status and then,
        // It must be found as is in the JSON response.
        $this->get(route('api.v1.users.show', $user), $body)
            ->assertStatus(200)
            ->assertExactJson($user->toArray());
    }

    /** @test */
    public function a_user_can_update_a_user()
    {
        // The user to be updated.
        $user = User::first();
        $user->address = $this->faker->address;
        $user->update();

        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), []);

        // Assuming that the user is updated,
        // It must return a 200 response status and then,
        // It must be found as is in the JSON response.
        $this->patch(route('api.v1.users.update', $user), $body)
            ->assertStatus(200)
            ->assertExactJson($user->toArray());
    }

    /** @test */
    public function a_user_can_delete_a_user()
    {
        // The user to be deleted.
        $user = User::latest()->first();

        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), []);

        // Decremented counter.
        $decremented =  User::count() - 1;

        // Assuming that the API will delete one,
        // It must return a 200 response status and then,
        // It must equal this decremented counter.
        $this->delete(route('api.v1.users.destroy', $user), $body)
            ->assertStatus(200)
            ->assertJsonFragment([
                'total' => $decremented
            ]);
    }

    /** @test */
    public function a_user_can_restore_a_user()
    {
        // Delete a user, it will then be restored.
        $deletedUser = User::latest()->first();
        $deletedUser->delete();

        // Incremented counter
        $incremented =  User::count() + 1;

        // Get the deleted user.
        $recoverableUser = User::withTrashed()->find($deletedUser->id);

        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), []);

        // Assuming that the users count is decremented after deleting one,
        // It must return a 200 response status and then,
        // It must equal this incremented counter.
        $this->patch(route('api.v1.users.restore', $recoverableUser), $body)
            ->assertStatus(200)
            ->assertJsonFragment([
                'total' => $incremented
            ]);
    }

    /** @test */
    public function a_user_can_store_an_avatar()
    {
        // The user to upload the file for.
        $user = User::first();

        // Store a fake avatar.
        $response = $this->storeAvatar($user);

        $data = $response->decodeResponseJson();

        // The original & thumbnail file should exist in the disk.
        Storage::disk(config('filesystems.default'))
            ->assertExists("{$data['directory']}/{$data['filename']}")
            ->assertExists("{$data['directory']}/thumbnails/{$data['filename']}");
    }

    /** @test */
    public function a_user_can_destroy_an_avatar()
    {
        // The user to upload the file for.
        $user = User::first();

        // Fake an upload so that we could destroy it.
        $response = $this->storeAvatar($user);

        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload());

        // Assuming that the user's avatar is removed,
        // It must return a 200 response status and then,
        // It must return a response with a user containing
        // null upload attributes to indicate that it was completely destroyed.
        $response = $this->delete(route('api.v1.users.avatar.destroy', $user), $body)
            ->assertStatus(200)
            ->assertJsonFragment(
                array_fill_keys($user->getUploadAttributes(), null)
            );

        // The original & thumbnail file should not exist in the disk.
        Storage::disk(config('filesystems.default'))
            ->assertMissing("{$user->directory}/{$user->filename}")
            ->assertMissing("{$user->directory}/thumbnails/{$user->filename}");
    }

    /**
     * Store a fake avatar.
     *
     * @param App\User $user
     *
     * @return Illuminate\Foundation\Testing\TestResponse
     */
    protected function storeAvatar(User $user) : TestResponse
    {
        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), [
            'avatar' => UploadedFile::fake()->image('avatar.jpg')
        ]);

        // Assuming that the fake file has been uploaded,
        // It must return a 200 response status and then,
        // It must return a response with a user containing
        // non-null upload attributes.
        return $this->post(
            route('api.v1.users.avatar.store', $user),
            $body
        )
            ->assertStatus(200)
            ->assertJsonMissing(
                array_fill_keys($user->getUploadAttributes(), null)
            );
    }
}
