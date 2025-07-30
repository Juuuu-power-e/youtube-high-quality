document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('quality')
  const saveBtn = document.getElementById('save')

  // 기존 설정 불러오기
  chrome.storage.local.get(['preferredQuality'], (result) => {
    if (result.preferredQuality) {
      select.value = result.preferredQuality
    }
  })

  // 저장 버튼 클릭 시 설정 저장
  saveBtn.addEventListener('click', () => {
    const selected = select.value
    chrome.storage.local.set({ preferredQuality: selected }, () => {
      alert(`✅ ${selected} 화질로 저장됨`)
    })
  })
})
