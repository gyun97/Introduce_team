async function fetchGuestbookEntries() {
    try {
        const response = await fetch('http://localhost:5000/guestbook');
        if (!response.ok) {
            throw new Error('Failed to fetch guestbook entries');
        }
        const entries = await response.json();
        const entriesContainer = document.getElementById('guestbook-entries');
        entriesContainer.innerHTML = ''; // 기존 항목 초기화
        entries.forEach(entry => {
            entriesContainer.innerHTML += `
                <div class="guestbook-entry" data-id="${entry._id}">
                    <span class="author">${entry.name}</span>
                    <span class="date">${new Date(entry.date).toLocaleDateString()}</span>
                    <p class="message">${entry.message}</p>
                    <button class="delete-button" onclick="deleteEntry(event)">삭제</button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error:', error);
        alert('방명록을 불러오는 데 실패했습니다.');
    }
}

document.querySelector('.guestbook-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('guestbook-name').value;
    const message = document.getElementById('guestbook-message').value;

    try {
        const response = await fetch('http://localhost:5000/guestbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, message }),
        });

        if (!response.ok) {
            throw new Error('Failed to add guestbook entry');
        }

        // 성공적으로 추가되면 입력 필드를 비우고 목록을 새로고침
        document.getElementById('guestbook-name').value = '';
        document.getElementById('guestbook-message').value = '';
        fetchGuestbookEntries();
    } catch (error) {
        console.error('Error:', error);
        alert('방명록 항목을 추가하는 데 실패했습니다. 다시 시도해주세요.');
    }
});

async function deleteEntry(event) {
    const entryElement = event.target.closest('.guestbook-entry');
    const entryId = entryElement.dataset.id;

    try {
        const response = await fetch(`http://localhost:5000/guestbook/${entryId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 성공적으로 삭제되면 화면에서 해당 항목 제거
        entryElement.remove();
    } catch (error) {
        console.error('Error:', error);
        alert('방명록 항목을 삭제하는 데 실패했습니다: ' + error.message);
    }
}   

// 페이지 로드 시 방명록 항목 가져오기
document.addEventListener('DOMContentLoaded', fetchGuestbookEntries);