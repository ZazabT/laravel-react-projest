<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    //sign up or register
    
    public function register(Request $request){
        $validatedUser = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email', // Ensure it's a valid email format
                'max:255', // Limit length
                'unique:users,email', // Ensure it's unique in the users table
                'regex:/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/', // Custom regex for more stringent email validation
            ],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create($validatedUser);
        $token = $user->createToken($request->name)->plainTextToken;
        return [
            'user' => $user,
            'token' => $token
        ];
    }



    // login

    public function login(Request $request){    

    }

    // logout 

    public function logout(Request $request){

    }
}
