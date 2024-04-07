import Transport from 'winston-transport'
import axios from 'axios';
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isNode = typeof module !== 'undefined' && typeof module.exports !== 'undefined';

class TelegramTransporter extends Transport {
    tg: any
    constructor(opts: object, tg: any) {
        super(opts);
        this.tg = tg;
    }

    log(info: any, callback: any) {
        this.tg.sendMessage(info.message, info.level);
        callback();
    }
}

class TelegramLogger {
    private token: string;
    private channelName: string;
    private baseUrl: string;
    private env: any
    constructor(token: string, channelName: string) {
        this.isThereToken(token);
        this.isThereChannel(channelName);
        this.token = token;
        this.channelName = channelName;
        this.baseUrl = `https://api.telegram.org/bot${this.token}/`;
        this.env = this.detectEnv();
    }

    detectEnv() {
        if (isBrowser) return 'browser'
        if (isNode) return 'node'
    }

    isThereToken(token: string) {
        if (!token) throw new Error('there is no token in class constructor')
    }

    isThereChannel(channel: string) {
        if (!channel) throw new Error('there is no channel name in class constructor')
    }

    sendRequest(url: string, message: string) {
        let env = this.env;
        if (env == 'node')
            return this.nodeRequest(url, message)
        else if (env == 'browser')
            return this.browserRequest(url)

    }

    async browserRequest(url: string) {
        try {
            let { data }: any = await fetch(url);
            return data
        } catch (e: any) {
            console.log(e.response.data);
        }

    }

    async nodeRequest(baseURL: string, message: string) {
        try {
            const reqBody = { 'chat_id': this.channelName, 'text': message }
            await axios({ baseURL, data: reqBody })
        } catch (err) {
            console.log(err, 'got an error in https request');
        }
    }

    sendMessage(message: string, level = 'RANDOM') {
        let emoji = this.emojiMap()[level];
        if (level == 'RANDOM') {
            let emojiArray = Object.keys(this.emojiMap()).sort();
            let emojiIndex = emojiArray[this.getRandomNumber(1, 5)];
            emoji = this.emojiMap()[emojiIndex];
        }

        message = `${emoji} ${message}${this.getDate()}`;
        let url = `${this.baseUrl}sendMessage`;

        this.sendRequest(url, message);
    }

    emojiMap(): any {
        return {
            DEBUG: '🚧',
            INFO: '‍💬',
            NOTICE: '🕵',
            WARNING: '⚡️',
            ERROR: '🚨',
            CRITICAL: '🤒',
            ALERT: '👀',
            EMERGENCY: '🤕',
            emerg: '🤕',
            alert: '👀',
            crit: '🤒',
            error: '🚨',
            warning: 4,
            notice: '🕵',
            info: '‍💬',
            debug: '🚧'
        }
    }

    getDate() {
        let date = new Date();
        let hours = date.getHours();
        let minutes: any = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime
    }

    getRandomNumber(min: number, max: number) {
        return Math.round(Math.random() * (max - min) + min)
    }

    setWinstonTransporter(tg: any) {
        return new TelegramTransporter({ filename: 'error.log', level: 'info' }, tg)
    }
}

export { TelegramLogger }