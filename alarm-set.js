module.exports = (RED) => {
    RED.nodes.registerType('alarm-set', function(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        node.clock = RED.nodes.getNode(config.clock);

        node.on('input', (msg) => {
            if (msg.payload && msg.payload.time) node.clock.setTime(msg.payload.time);
            if (msg.payload && typeof(msg.payload.disabled) !== 'undefined') node.clock.setDisabled(msg.payload.disabled);
        });
    });
}
