<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Contact::all();
    }

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

        Contact::create($validatedData);

        return $validatedData;
    }
    


    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        return $contact;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_no' => ['required', 'string', 'regex:/^[0-9\-\+]{9,15}$/'],
            'type' => ['required', 'in:family,business,other,private,personal'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $contact->update($validatedData);

        return [
            'message' => 'id '.$contact->id.' Contact updated successfully',
            'contact' => $contact
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();
        
        return [
            'message' => 'id '.$contact->id.' Contact deleted successfully'];
    }
}
