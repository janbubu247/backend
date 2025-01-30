function socketpush(socketio) {
  var dd = undefined
  socketio.on("connection", function (socket) {
    console.log('socket connected');
    dd = socket
  }
  )
  return dd
  //   socket.on("qpay", (type) => {
  //     var body = "";
  //     if (type == "pay") {
  //       body = __("common.notifiAdd");
  //     }
  //     console.log("server socket:", type)
  //     socket.broadcast.emit("qpay", "yes");
  //     socket.emit("qpay", "yes");
  //   });

  //   socket.on("dataasuudal", (type) => {
  //     var body = "";
  //     if (type == "add") {
  //       body = __("common.notifiAdd");
  //     } else if (type == "update") {
  //       body = __("common.notifiUpdate");
  //     } else if (type == "delete") {
  //       body = __("common.notifiDelete");
  //     } else if (type == "changestatus") {
  //       body = __("common.notifiChangeStatus");
  //     }

  //     socket.broadcast.emit("notification", {
  //       type: "dataasuudal",
  //       title: __("data.asuudal.title"),
  //       body: body,
  //       actiontype: type,
  //     });
  //   });

  //   socket.on("dataasuulga", (type) => {
  //     var body = "";
  //     if (type == "add") {
  //       body = __("common.notifiAdd");
  //     } else if (type == "update") {
  //       body = __("common.notifiUpdate");
  //     } else if (type == "delete") {
  //       body = __("common.notifiDelete");
  //     } else if (type == "changestatus") {
  //       body = __("common.notifiChangeStatus");
  //     }

  //     socket.broadcast.emit("notification", {
  //       type: "dataasuulga",
  //       title: __("data.asuulga.title"),
  //       body: body,
  //       actiontype: type,
  //     });
  //   });

  //   socket.on("dataersdel", (type) => {
  //     var body = "";
  //     if (type == "add") {
  //       body = __("common.notifiAdd");
  //     } else if (type == "update") {
  //       body = __("common.notifiUpdate");
  //     } else if (type == "delete") {
  //       body = __("common.notifiDelete");
  //     } else if (type == "changestatus") {
  //       body = __("common.notifiChangeStatus");
  //     }

  //     socket.broadcast.emit("notification", {
  //       type: "dataersdel",
  //       title: __("data.ersdel.title"),
  //       body: body,
  //       actiontype: type,
  //     });
  //   });

  //   socket.on("datazuvlumj", (type) => {
  //     var body = "";
  //     if (type == "add") {
  //       body = __("common.notifiAdd");
  //     } else if (type == "update") {
  //       body = __("common.notifiUpdate");
  //     } else if (type == "delete") {
  //       body = __("common.notifiDelete");
  //     } else if (type == "changestatus") {
  //       body = __("common.notifiChangeStatus");
  //     }

  //     socket.broadcast.emit("notification", {
  //       type: "datazuvlumj",
  //       title: __("data.zuvlumj.title"),
  //       body: body,
  //       actiontype: type,
  //     });
  //   });

  //   socket.on("chat", (message) => {
  //     socket.broadcast.emit("chat", { message });
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("socket sallaa");
  //     socketio.emit("comment", "socket sallaa");
  //   });
  // });

}
module.exports = socketpush;
