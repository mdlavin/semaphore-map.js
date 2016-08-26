Easily track many different semaphores by keys
==============================================

An easy way to lock on a dynamic set of keys without having to worry about
resource management. If the list of named locks is fixed then a simple Map
could be used and each semaphore could be created on demand. If the list of
locks is dynamic, possibly by userId, then you might want to cleanup unused
locks to avoid running out of memory.

Here is an example where you might want to restrict the amount of parallel
requests for each user down to 1. Imagine that there are thousands or millions
of users in the system, so leaving the locks in memory is not feasible.


    // Initialize the map of locks
    var SemaphoreMap = require('semaphore-map');
    var userLocks = new SemaphoreMap();
    
    // For each request from a user
    var userId = <some-user-id-lookup>
    userLocks.take(userId, function() {
        // Do some work for the user

        userLocks.leave(userId);
    });

The semaphore-map project will take care of cleaning up unused locks even if
a wide range of users perform actions against the server.
