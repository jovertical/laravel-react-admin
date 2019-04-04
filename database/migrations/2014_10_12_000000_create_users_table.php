<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('type', ['superuser', 'user']);
            $table->string('name');
            $table->string('username')->nullable();
            $table->string('email');
            $table->string('password')->nullable();
            $table->rememberToken();
            $table->text('auth_token')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('last_signin')->nullable();

            $table->string('firstname')->nullable();
            $table->string('middlename')->nullable();
            $table->string('lastname')->nullable();
            $table->enum('gender', ['male', 'female', ''])->nullable();
            $table->date('birthdate', 'Y-m-d')->nullable();
            $table->text('address')->nullable();

            $table->string('directory')->nullable();
            $table->string('filename')->nullable();
            $table->string('original_filename')->nullable();
            $table->integer('filesize')->nullable();
            $table->integer('thumbnail_filesize')->nullable();
            $table->text('url')->nullable();
            $table->text('thumbnail_url')->nullable();

            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->string('deleted_by')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
