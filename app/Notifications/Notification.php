<?php

namespace App\Notifications;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldQueue;

class Notification implements ShouldQueue
{
    use InteractsWithQueue, Dispatchable, SerializesModels;
}