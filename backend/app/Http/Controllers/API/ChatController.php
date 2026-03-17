<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;

use App\Events\MessageSent;
use Auth;
use Illuminate\Http\Request;
use App\Models\Message;

class ChatController extends Controller
{

 public function messages($id)
{
    $messages = Message::where(function ($query) use ($id) {
            $query->where('sender_id', auth()->id())
                  ->where('receiver_id', $id);
        })
        ->orWhere(function ($query) use ($id) {
            $query->where('sender_id', $id)
                  ->where('receiver_id', auth()->id());
        })
        ->orderBy('created_at','asc')
        ->get();

    return response()->json($messages);
}



    public function sendMessage(Request $request)
{

    $data = [
        'sender_id' => Auth::id(),
        'receiver_id' => $request->receiver_id,
        'message' => $request->message,
        'type' => 'text'
    ];

    if ($request->hasFile('file')) {

        $file = $request->file('file');

        $path = $file->store('chat_files', 'public');

        $data['file_path'] = $path;

        if (str_contains($file->getMimeType(), 'image')) {
            $data['type'] = 'image';
        } else {
            $data['type'] = 'file';
        }

    }

    $msg = Message::create($data);

    // broadcast(new MessageSent($msg))->toOthers();
    // broadcast(new MessageSent($msg))->to("chat.{$msg->receiver_id}");

 broadcast(new MessageSent($msg))->toOthers();
//  \Log::info('Broadcast fired', ['message' => $msg]);

    return response()->json($msg);
}


}
