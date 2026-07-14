# Kicker Hax Cordova

Wrapper Cordova do Kicker Hax. Ele abre a versão publicada no GitHub Pages, então o app recebe a atualização assim que o deploy web muda.

Comandos base:

```bash
npm install -g cordova
cd cordova-app
cordova platform add android
cordova build android
```

O app força orientação horizontal, tela cheia e usa o ícone em `res/icon/android/icon.png`.
