const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const templatePath = __dirname + '/templates/';

app.get('/', function (req, res) {
    res.sendFile(templatePath + 'main.html');
});

let players = [];

io.on('connection', function (socket) {
    const player = {
        id: socket.id,
        x: 50 + 300 * Math.random(),
        y: 50 + 200 * Math.random()
    };
    
    socket.on('disconnect', function () {
        console.log('player disconnected ' + player.id);
        io.emit('disconnect', player.id);

        players.forEach(function (p) {
            if (p.id == player.id) {
                players.splice(players.indexOf(p), 1);
            }
        });
    });

    socket.on('join', function () {
        console.log('player join ' + player.id);
        
        players.push(player);
        io.emit('join', players);
    });

    socket.on('move', function (data) {
        //console.log('move ' + player.id);
        player.x = data.x;
        player.y = data.y;
        io.emit('move', player);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});