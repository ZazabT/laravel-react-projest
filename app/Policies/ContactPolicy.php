<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ContactPolicy
{
  public function modify(User $user , Contact $contact):Response{
   return $user->id == $contact->user_id ? Response :: allow() : Response :: deny('You do not have authority to this Contact');
  }
}
