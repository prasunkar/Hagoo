"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HagooCommand = void 0;
const framework_1 = require("@sapphire/framework");
class HagooCommand extends framework_1.Command {
    constructor(context) {
        super(context, {
            name: 'hagoo',
            description: 'go hagoo someone',
        });
    }
    messageRun(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = args.finished ? message.guild.members.cache.filter(member => !member.user.bot).random() : yield args.pick('member');
            console.log(message.guild.members.cache.filter(member => !member.user.bot));
            yield message.channel.send(`lmao ${user} just got hagooed`);
        });
    }
}
exports.HagooCommand = HagooCommand;
