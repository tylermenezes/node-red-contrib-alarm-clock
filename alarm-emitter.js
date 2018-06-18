module.exports = (RED) => {
    RED.nodes.registerType('alarm-emitter', function(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        node.name = config.name;
        node.clock = RED.nodes.getNode(config.clock);
        node.offset = config.offset;

        const timewiseAdd = (init, offset) => (((init+offset)%(60*60*24))+(60*60*24))%(60*60*24);

        var inCooldown = false;
        const tickHandle = setInterval(function() {
            if (inCooldown) return;

            if (node.clock && node.clock.time && !node.clock.disabled) {
                const now = new Date();
                const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0);
                const sinceMidnight = Math.round((now.getTime() - midnight.getTime())/1000);
                const offsetTime = timewiseAdd(parseInt(node.clock.time), parseInt(node.offset||0));

                if (Math.abs(sinceMidnight - offsetTime) < 2) {
                    inCooldown = true;
                    setTimeout(() => inCooldown = false, 5000);
                    node.send({payload: sinceMidnight});
                }
            }
        }, 1000);

        this.on('close', () => clearInterval(tickHandle));
    });
}
