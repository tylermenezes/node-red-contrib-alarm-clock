module.exports = (RED) => {
    const fs = require("fs-extra");

    RED.nodes.registerType('alarm-clock', function (config) {
        const node = this;
        RED.nodes.createNode(node, config);

        node.name = config.name || 'Untitled Clock';

        node.time = 7*60*60;
        node.disabled = false;

        const fname = 'alarm-'+node.name.replace(/[^A-Za-z0-9]/ig, "-")+'.json';

        // Save/Load Functions
        const save = () => {
            try {
                fs.outputJsonSync(fname, {
                    time: node.time,
                    disabled: node.disabled || false,
                });
            } catch (err) {
                node.error(err.message);
            }
        }
        (() => {
            try {
                const ctx = fs.readJsonSync(fname);
                this.time = ctx.time;
                this.disabled = ctx.disabled;
            } catch (err) {}
        })();

        node.setTime = (time) => {
            node.time = time;
            save();
        }

        node.setDisabled = (disabled) => {
            node.disabled = disabled;
            save();
        }
    });
}
