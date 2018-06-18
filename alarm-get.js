module.exports = (RED) => {
    RED.nodes.registerType('alarm-get', function(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        node.clock = RED.nodes.getNode(config.clock);

        node.on('input', (msg) => {
            const sec = parseInt(node.clock.time);
            const now = new Date();
            const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0);
            var nextRing = new Date(midnight.getTime());
            nextRing.setSeconds(sec);
            if (nextRing < now) nextRing.setSeconds(nextRing.getSeconds() + 60*60*24);

            node.send({payload:{
                secondsPastMidnight: sec,
                date: nextRing,
                str: (String(nextRing.getHours()).padStart(2, '0') + ":" + String(nextRing.getMinutes()).padStart(2, '0') + ":" + String(nextRing.getSeconds()).padStart(2, '0'))
            }});
        });
    });
}
