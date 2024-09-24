<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    // Apply middleware using the constructor
    // public function __construct()
    // {
    //     // Apply 'auth:sanctum' middleware to store, update, and delete methods
    //     $this->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);
    // }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        // Get the authenticated user
        $user = Auth::user();
        
        if ($user) {
            // Fetch contacts where user_id matches the authenticated user's ID
            $contacts = Contact::where('user_id', $user->id)->get();
            return response()->json($contacts);
        }
    
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    /** 
     * Get all contacts for the authenticated user
     */
    
     
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_no' => ['required', 'string', 'regex:/^[0-9\-\+]{9,15}$/'],
            'type' => ['required', 'in:family,business,other,private,personal'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);
        
        // Create contact for the authenticated user
        $user = Auth::user();
        $contact = $user->contacts()->create($validatedData);
        return response()->json($contact, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        return $contact; // Public route
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        Gate::authorize('modify' , $contact);
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_no' => ['required', 'string', 'regex:/^[0-9\-\+]{9,15}$/'],
            'type' => ['required', 'in:family,business,other,private,personal'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        // Update contact
        $contact->update($validatedData);

        return response()->json([
            'message' => 'Contact ID ' . $contact->id . ' updated successfully',
            'contact' => $contact
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( Contact $contact)
    {
        Gate::authorize('modify' , $contact);
        $contact->delete();
        
        return response()->json([
            'message' => 'Contact ID ' . $contact->id . ' deleted successfully'
        ]);
    }
}
