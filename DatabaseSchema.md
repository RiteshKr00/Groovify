# Database Schema

## User

- name: a string
- email: a string
- password: a (hashed) string
- resetToken: a string field for reset token for password reset feature.
- expireToken: a Date field that represents the expiration time of the reset token.

## Tracks

- trackId: a string (unique) represents the id of the track.
- trackName: a string (unique) and represents the name of the track.
- albumName: a string represents the name of the album the track belongs to.
- artistList: an array of string represents the list of artists associated with the track.
- duration: a number represent duration of the track in milliseconds.
- trackUrl: a string represents the url of the track.

## Playlist

- name: a string represents the name of the playlist.
- description: a string represents the description of the playlist.
- songs: an array of ObjectId fields that references the Track documents in the collection.
- createdBy: an ObjectId field that references the User document that created the playlist in the collection.
