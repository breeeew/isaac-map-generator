import './index.css';
import * as Pixi from 'pixi.js';
import roomImg from './img/room.png';
import bossRoomImg from './img/boss-room.png';
import secretRoomImg from './img/secret-room.png';
import shopRoomImg from './img/shop-room.png';
import RoomGenerator from './map';

const loader = Pixi.Loader.shared;

loader.add('room', roomImg);
loader.add('secretRoom', secretRoomImg);
loader.add('shopRoom', shopRoomImg);
loader.add('bossRoom', bossRoomImg);

loader.load(() => {
    const roomGenerator = new RoomGenerator({
        level: 8,
    });

    const rooms = roomGenerator.getMap();

    const app = new Pixi.Application({
        width: 600,
        height: 600,
    });

    const sprites: Pixi.Sprite[] = [];

    (async () => {
        for (const [x, y] of rooms) {
            const sprite = new Pixi.Sprite(Pixi.Loader.shared.resources.room.texture);

            sprite.x = x * sprite.width;
            sprite.y = y * sprite.height;
            sprite.alpha = 0.1;
            sprites.push(sprite);
            sprite.interactive = true;

            sprite.on('pointerdown', () => {
                console.log(sprite.x / sprite.width, sprite.y / sprite.height);
            });

            sprite.on('pointerover', () => {
                sprite.alpha = 0.5;
            });

            sprite.on('pointerout', () => {
                sprite.alpha = 1;
            });

            app.stage.addChild(sprite);
            await new Promise(res => setTimeout(() => res(), 30));
        }
    })();

    let isCreated = false;
    app.ticker.add(() => {
        if (isCreated) {
            return;
        }

        for (const sprite of sprites) {
            if (sprite.alpha < 1) {
                sprite.alpha += 0.1;
            }
        }

        isCreated = sprites.every(sprite => sprite.alpha >= 1);
    });

    document.body.appendChild(app.view);
});
