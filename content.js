function simulateClick(el) {
  if (!el) return
  el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

function getUserPreferredQuality(callback) {
  chrome.storage.local.get(['preferredQuality'], (result) => {
    callback(result.preferredQuality || null)
  })
}

function openAndSetQuality() {
  const settingsButton = document.querySelector('.ytp-settings-button')
  if (!settingsButton) return
  simulateClick(settingsButton)

  setTimeout(() => {
    const qualityLabel = [
      ...document.querySelectorAll('.ytp-menuitem-label'),
    ].find(
      (el) => el.innerText.includes('화질') || el.innerText.includes('Quality')
    )
    if (!qualityLabel) return
    simulateClick(qualityLabel)

    setTimeout(() => {
      const menuItems = [
        ...document.querySelectorAll('.ytp-quality-menu .ytp-menuitem'),
      ]

      getUserPreferredQuality((preferredQuality) => {
        let target = null

        if (preferredQuality) {
          target = menuItems.find((el) =>
            el.innerText.includes(preferredQuality)
          )
        }

        // fallback: 가장 높은 화질 선택
        if (!target && menuItems.length > 0) {
          target = menuItems[0] // 맨 위에 있는 항목이 보통 최고 화질
        }

        if (target) {
          simulateClick(target)
          console.log(`✅ 화질 설정됨: ${target.innerText.trim()}`)
        } else {
          console.warn('❌ 화질 항목을 찾지 못함')
        }
      })
    }, 500)
  }, 500)
}

if (location.pathname.startsWith('/watch')) {
  setTimeout(openAndSetQuality, 2000)
}

window.addEventListener('yt-navigate-finish', () => {
  if (location.pathname.startsWith('/watch')) {
    setTimeout(openAndSetQuality, 2000)
  }
})
