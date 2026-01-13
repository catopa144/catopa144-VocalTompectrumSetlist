document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let repertoire = [];
    let setlist = [];

    // --- DOM Elements ---
    const repertoireList = document.getElementById('repertoire-list');
    const setlistList = document.getElementById('setlist-list');
    const totalTimeDisplay = document.getElementById('total-time');
    const sortSelect = document.getElementById('sort-repertoire');

    // Modal Elements
    const addSongBtn = document.getElementById('add-song-btn');
    const addSongModal = document.getElementById('add-song-modal');
    const addSongForm = document.getElementById('add-song-form');

    // Import Elements
    const importBtn = document.getElementById('import-btn');
    const importModal = document.getElementById('import-modal');
    const importForm = document.getElementById('import-form');

    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = addSongForm.querySelector('button[type="submit"]');

    // --- Initialization ---
    loadData();
    // Safety check: remove invalid entries
    cleanupSetlist();

    renderRepertoire();
    renderSetlist();
    updateTotalTime();

    // --- Event Listeners ---
    addSongBtn.addEventListener('click', () => openModal());

    if (importBtn) {
        importBtn.addEventListener('click', () => {
            importModal.classList.remove('hidden');
            const textarea = document.getElementById('import-json');
            textarea.value = '';
            textarea.focus();
        });
    }

    if (importForm) {
        importForm.addEventListener('submit', handleImportData);
    }

    // Setlist Drag & Drop Listeners (INITIALIZED ONCE HERE)
    setlistList.addEventListener('dragover', handleDragOver);
    setlistList.addEventListener('drop', handleDropOnList);

    if (sortSelect) {
        sortSelect.addEventListener('change', renderRepertoire);
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addSongModal || e.target === importModal) closeModal();
    });

    addSongForm.addEventListener('submit', handleSaveSong);

    // --- Core Functions ---

    function loadData() {
        const storedRepertoire = localStorage.getItem('vt_repertoire_v3');
        const storedSetlist = localStorage.getItem('vt_setlist_v3');

        if (storedRepertoire) {
            repertoire = JSON.parse(storedRepertoire);
        } else {
            // Default data for first run
            repertoire = [
                {
                    "id": "1",
                    "title": "Irish Blessing",
                    "duration": 108,
                    "year": 2017
                },
                {
                    "id": "1768306557815",
                    "title": "Go the Distance",
                    "duration": 210,
                    "year": 2024
                },
                {
                    "id": "1768306672042",
                    "title": "Tonight",
                    "duration": 120,
                    "year": 2025
                },
                {
                    "id": "1768307095270",
                    "title": "You Don't Have to Be a Baby to Cry",
                    "duration": 120,
                    "year": 2025
                },
                {
                    "id": "1768307196801",
                    "title": "Seven Bridges Road",
                    "duration": 210,
                    "year": 2025
                },
                {
                    "id": "1768307283478",
                    "title": "Pass Me the Jazz",
                    "duration": 210,
                    "year": 2026
                },
                {
                    "id": "1768307325544",
                    "title": "You Don't You Won't",
                    "duration": 150,
                    "year": 2026
                },
                {
                    "id": "1768308226592",
                    "title": "I'm Sitting on Top of the World",
                    "duration": 105,
                    "year": 2013
                },
                {
                    "id": "1768308246784",
                    "title": "Crazy Little Thing Called Love",
                    "duration": 120,
                    "year": 2016
                },
                {
                    "id": "1768308277214",
                    "title": "Unbelievable",
                    "duration": 140,
                    "year": 2017
                },
                {
                    "id": "1768308304299",
                    "title": "Why Don't We Just Dance?",
                    "duration": 140,
                    "year": 2025
                },
                {
                    "id": "1768308337420",
                    "title": "Let's Live it Up!",
                    "duration": 150,
                    "year": 2025
                },
                {
                    "id": "1768308356336",
                    "title": "Country Boy",
                    "duration": 150,
                    "year": 2023
                },
                {
                    "id": "1768308375255",
                    "title": "Teddy Bear",
                    "duration": 120,
                    "year": 2014
                },
                {
                    "id": "1768308403363",
                    "title": "Come Fly With Me",
                    "duration": 120,
                    "year": 2017
                },
                {
                    "id": "1768308425020",
                    "title": "Everything",
                    "duration": 195,
                    "year": 2014
                },
                {
                    "id": "1768308445803",
                    "title": "Talofa Teine",
                    "duration": 160,
                    "year": 2015
                },
                {
                    "id": "1768308470519",
                    "title": "Barbara Ann",
                    "duration": 120,
                    "year": 2016
                },
                {
                    "id": "1768308499329",
                    "title": "I Can't Give You Anything But Live",
                    "duration": 190,
                    "year": 2023
                },
                {
                    "id": "1768308534155",
                    "title": "All You Need is Love",
                    "duration": 195,
                    "year": 2016
                },
                {
                    "id": "1768308534160",
                    "title": "Georgia On My Mind",
                    "duration": 270,
                    "year": 2020
                },
                {
                    "id": "1768308534161",
                    "title": "Just the Way You Are",
                    "duration": 150,
                    "year": 2024
                },
                {
                    "id": "1768308548261",
                    "title": "Happy Together",
                    "duration": 210,
                    "year": 2015
                },
                {
                    "id": "1768308589559",
                    "title": "Country Roads",
                    "duration": 130,
                    "year": 2015
                },
                {
                    "id": "1768308613660",
                    "title": "Between the Devil and the Deep Blue Sea",
                    "duration": 210,
                    "year": 2025
                },
                {
                    "id": "1768308640234",
                    "title": "I Love Jazz Medley",
                    "duration": 210,
                    "year": 2024
                },
                {
                    "id": "1768308673616",
                    "title": "Santa Claus is Comin' To Town",
                    "duration": 120,
                    "year": 2025
                },
                {
                    "id": "1768308694042",
                    "title": "Hello My Baby",
                    "duration": 130,
                    "year": 2025
                },
                {
                    "id": "1768308705354",
                    "title": "Blue Skies",
                    "duration": 130,
                    "year": 2025
                },
                {
                    "id": "1768308732335",
                    "title": "Too Darn Hot",
                    "duration": 240,
                    "year": 2024
                },
                {
                    "id": "1768308766626",
                    "title": "Come on Get Happy",
                    "duration": 120,
                    "year": 2016
                },
                {
                    "id": "1768308796379",
                    "title": "That's Christmas To Me",
                    "duration": 210,
                    "year": 2025
                },
                {
                    "id": "1768308831713",
                    "title": "There will be another you",
                    "duration": 150,
                    "year": 2017
                },
                {
                    "id": "1768308854924",
                    "title": "Steppin' Out With My Baby",
                    "duration": 180,
                    "year": 2018
                },
                {
                    "id": "1768308877358",
                    "title": "Paper Moon",
                    "duration": 135,
                    "year": 2018
                },
                {
                    "id": "1768308906775",
                    "title": "Follow Me",
                    "duration": 140,
                    "year": 2019
                },
                {
                    "id": "1768308927931",
                    "title": "Sugar",
                    "duration": 240,
                    "year": 2024
                },
                {
                    "id": "1768308949423",
                    "title": "After You've Gone",
                    "duration": 130,
                    "year": 2018
                },
                {
                    "id": "1768308972707",
                    "title": "Hark! the Herald Angel Sing",
                    "duration": 150,
                    "year": 2024
                },
                {
                    "id": "1768308996043",
                    "title": "Away in a Manger",
                    "duration": 180,
                    "year": 2025
                },
                {
                    "id": "1768309043619",
                    "title": "One More Last Chance",
                    "duration": 150,
                    "year": 2024
                },
                {
                    "id": "1768309086553",
                    "title": "When the Saints Go Marchin' In",
                    "duration": 120,
                    "year": 2025
                },
                {
                    "id": "1768309117152",
                    "title": "Welcome Chsitmas",
                    "duration": 240,
                    "year": 2022
                },
                {
                    "id": "1768309161917",
                    "title": "That Old Black Magic",
                    "duration": 180,
                    "year": 2023
                },
                {
                    "id": "1768309202039",
                    "title": "I Get Around",
                    "duration": 120,
                    "year": 2021
                },
                {
                    "id": "1768309218915",
                    "title": "Sold!",
                    "duration": 120,
                    "year": 2023
                },
                {
                    "id": "1768309240005",
                    "title": "You Can Fly!",
                    "duration": 150,
                    "year": 2024
                },
                {
                    "id": "1768309259771",
                    "title": "We Wish a Merry Christmas",
                    "duration": 60,
                    "year": 2024
                },
                {
                    "id": "1768309291318",
                    "title": "Goodnight Sweetheart",
                    "duration": 120,
                    "year": 2022
                },
                {
                    "id": "1768309315949",
                    "title": "When I see an Elephant Fly",
                    "duration": 150,
                    "year": 2023
                },
                {
                    "id": "1768309324057",
                    "title": "Hold On",
                    "duration": 180,
                    "year": 2023
                },
                {
                    "id": "1768309342535",
                    "title": "Your Man",
                    "duration": 180,
                    "year": 2025
                },
                {
                    "id": "1768309369300",
                    "title": "How Deep is Your Love",
                    "duration": 180,
                    "year": 2025
                },
                {
                    "id": "1768309412523",
                    "title": "Chordbuster March",
                    "duration": 105,
                    "year": 2024
                },
                {
                    "id": "1768309461750",
                    "title": "It's You",
                    "duration": 210,
                    "year": 2024
                },
                {
                    "id": "1768309474807",
                    "title": "You and I",
                    "duration": 240,
                    "year": 2024
                },
                {
                    "id": "1768309496354",
                    "title": "I Can Dream, Can't I?",
                    "duration": 210,
                    "year": 2025
                },
                {
                    "id": "1768309512432",
                    "title": "Day in, Day out",
                    "duration": 180,
                    "year": 2025
                },
                {
                    "id": "1768309543949",
                    "title": "I Won't Last a Day without You",
                    "duration": 270,
                    "year": 2025
                },
                {
                    "id": "1768309565910",
                    "title": "Smile",
                    "duration": 150,
                    "year": 2023
                },
                {
                    "id": "1768309601770",
                    "title": "That Lucky Old Sun",
                    "duration": 300,
                    "year": 2019
                },
                {
                    "id": "1768307119565",
                    "title": "Aladdin Medley",
                    "duration": 585,
                    "year": 2024
                },
                {
                    "id": "1768309660902",
                    "title": "From the First Hello to the Last Goodbye",
                    "duration": 180,
                    "year": 2025
                },
                {
                    "id": "1768309688133",
                    "title": "Så skimrande var aldrig havet",
                    "duration": 150,
                    "year": 2020
                },
                {
                    "id": "1768309714447",
                    "title": "South Rampart Street Parade",
                    "duration": 210,
                    "year": 2025
                },
                {
                    "id": "1768309738132",
                    "title": "Yes Ineed!",
                    "duration": 210,
                    "year": 2023
                },
                {
                    "id": "1768309770556",
                    "title": "Love Walked in",
                    "duration": 210,
                    "year": 2020
                },
                {
                    "id": "1768309812298",
                    "title": "This is the Moment",
                    "duration": 210,
                    "year": 2025
                },
                {
                    "id": "1768309902243",
                    "title": "Superman",
                    "duration": 220,
                    "year": 2018
                }
            ]
            saveData();
        }

        if (storedSetlist) {
            setlist = JSON.parse(storedSetlist);
        }
    }

    function cleanupSetlist() {
        if (!Array.isArray(setlist)) {
            setlist = [];
            return;
        }
        // Filter out null/undefined or items without duration
        const initialLength = setlist.length;
        setlist = setlist.filter(item => item && typeof item.duration === 'number');
        if (setlist.length !== initialLength) {
            console.log('Cleaned up corrupted setlist items');
            saveData();
        }
    }

    function saveData() {
        localStorage.setItem('vt_repertoire_v3', JSON.stringify(repertoire));
        localStorage.setItem('vt_setlist_v3', JSON.stringify(setlist));
    }

    function renderRepertoire() {
        const sortType = sortSelect ? sortSelect.value : 'alpha-asc';
        let displayRepertoire = [...repertoire];

        if (sortType === 'alpha-asc') {
            displayRepertoire.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === 'time-asc') {
            displayRepertoire.sort((a, b) => a.duration - b.duration);
        } else if (sortType === 'time-desc') {
            displayRepertoire.sort((a, b) => b.duration - a.duration);
        } else if (sortType === 'year-desc') {
            displayRepertoire.sort((a, b) => (b.year || 0) - (a.year || 0));
        } else if (sortType === 'year-asc') {
            displayRepertoire.sort((a, b) => (a.year || 0) - (b.year || 0));
        }

        repertoireList.innerHTML = '';
        displayRepertoire.forEach((song) => {
            // Find the original index for operations that require it
            const originalIndex = repertoire.findIndex(r => r.id === song.id);

            const card = document.createElement('div');
            card.className = 'song-card repertoire-item';
            card.draggable = true;

            // Drag Start
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'new', songIndex: originalIndex }));
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });

            const yearBadge = song.year ? `<span class="song-year">${song.year}</span>` : '';

            card.innerHTML = `
                <div class="song-info">
                    <span class="song-title">${escapeHtml(song.title)}</span>
                    ${yearBadge}
                </div>
                <div class="card-actions">
                    <span class="song-duration">${formatTime(song.duration)}</span>
                     <button class="remove-btn edit-repertoire-btn" aria-label="Edit Song" title="Edit Song">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 17l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    </button>
                    <button class="remove-btn remove-repertoire-btn" aria-label="Delete from Repertoire" title="Delete from Repertoire">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </button>
                </div>
            `;

            const editBtn = card.querySelector('.edit-repertoire-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(originalIndex);
            });

            const deleteBtn = card.querySelector('.remove-repertoire-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete "${song.title}" from your repertoire?`)) {
                    removeFromRepertoire(originalIndex);
                }
            });

            repertoireList.appendChild(card);
        });
    }

    function removeFromRepertoire(index) {
        repertoire.splice(index, 1);
        saveData();
        renderRepertoire();
    }

    function renderSetlist() {
        setlistList.innerHTML = '';

        // NOTE: Event Listeners removed from here to prevent accumulation.
        // They are now set once in the Event Listeners section.

        if (setlist.length === 0) {
            setlistList.innerHTML = `
                <div class="empty-state">
                    <p>Drag songs here from the repertoire.</p>
                </div>
            `;
            return;
        }

        setlist.forEach((song, index) => {
            const card = document.createElement('div');
            card.className = 'song-card setlist-item';
            card.draggable = true;
            card.dataset.index = index;

            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'reorder', fromIndex: index }));
                card.classList.add('dragging');
                e.stopPropagation();
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            });

            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                card.classList.add('drag-over');
            });

            card.addEventListener('dragleave', () => {
                card.classList.remove('drag-over');
            });

            card.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                card.classList.remove('drag-over');
                handleDropOnItem(e, index);
            });

            // Display year in setlist too
            const yearBadge = song.year ? `<span class="song-year">${song.year}</span>` : '';

            card.innerHTML = `
                <div class="song-info">
                    <span class="song-title">${index + 1}. ${escapeHtml(song.title)}</span>
                    ${yearBadge}
                </div>
                <span class="song-duration">${formatTime(song.duration)}</span>
                <button class="remove-btn remove-setlist-btn" aria-label="Remove">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            `;

            const removeBtn = card.querySelector('.remove-setlist-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromSetlist(index);
            });

            setlistList.appendChild(card);
        });
    }

    // --- Drag and Drop Handlers ---

    function handleDragOver(e) {
        e.preventDefault();
        setlistList.classList.add('drag-over-container');
    }

    function handleDropOnList(e) {
        e.preventDefault();
        setlistList.classList.remove('drag-over-container');
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));

            if (data.type === 'new') {
                addToSetlist(repertoire[data.songIndex]);
            } else if (data.type === 'reorder') {
                const item = setlist.splice(data.fromIndex, 1)[0];
                setlist.push(item);
                saveData();
                renderSetlist();
                updateTotalTime();
            }
        } catch (err) {
            console.error('Drop error:', err);
        }
    }

    function handleDropOnItem(e, toIndex) {
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));

            if (data.type === 'new') {
                const song = repertoire[data.songIndex];
                const songCopy = { ...song, uniqueId: Date.now() + Math.random() };
                setlist.splice(toIndex, 0, songCopy);
            } else if (data.type === 'reorder') {
                const fromIndex = data.fromIndex;
                const item = setlist.splice(fromIndex, 1)[0];

                let insertIndex = toIndex;
                if (fromIndex < toIndex) {
                    insertIndex = toIndex - 1;
                } else {
                    insertIndex = toIndex;
                }
                if (insertIndex < 0) insertIndex = 0;

                setlist.splice(insertIndex, 0, item);
            }

            saveData();
            renderSetlist();
            updateTotalTime();
        } catch (err) {
            console.error('Drop on item error:', err);
        }
    }

    function addToSetlist(song) {
        if (!song) return;
        const songCopy = { ...song, uniqueId: Date.now() + Math.random() };
        setlist.push(songCopy);
        saveData();
        renderSetlist();
        updateTotalTime();
    }

    function removeFromSetlist(index) {
        setlist.splice(index, 1);
        saveData();
        renderSetlist();
        updateTotalTime();
    }

    function handleSaveSong(e) {
        e.preventDefault();
        const idInput = document.getElementById('song-id');
        const titleInput = document.getElementById('song-title');
        const durationInput = document.getElementById('song-duration');
        const yearInput = document.getElementById('song-year');

        const id = idInput.value;
        const title = titleInput.value.trim();
        const durationStr = durationInput.value.trim();
        const year = yearInput.value.trim() ? parseInt(yearInput.value.trim(), 10) : null;

        if (title && durationStr) {
            const seconds = parseDuration(durationStr);
            if (seconds > 0) {
                if (id) {
                    // Update existing
                    const index = repertoire.findIndex(s => s.id === id);
                    if (index !== -1) {
                        repertoire[index].title = title;
                        repertoire[index].duration = seconds;
                        repertoire[index].year = year;
                    }
                } else {
                    // Create new
                    const newSong = {
                        id: Date.now().toString(),
                        title: title,
                        duration: seconds,
                        year: year
                    };
                    repertoire.push(newSong);
                }

                saveData();
                renderRepertoire();

                // Update setlist copies if matching
                if (id) {
                    setlist.forEach(item => {
                        if (item.id === id) {
                            item.title = title;
                            item.duration = seconds;
                            item.year = year;
                        }
                    });
                    saveData();
                    renderSetlist();
                    updateTotalTime();
                }

                closeModal();
            } else {
                alert('Invalid duration format. Please use mm:ss');
            }
        }
    }

    function handleImportData(e) {
        e.preventDefault();
        const textarea = document.getElementById('import-json');
        const jsonString = textarea.value.trim();

        if (!jsonString) return;

        try {
            const data = JSON.parse(jsonString);

            if (Array.isArray(data)) {
                // Basic validation
                const isValid = data.every(item => item && item.title && typeof item.duration === 'number');

                if (isValid) {
                    if (confirm(`読み込みに成功しました！\n${data.length} 曲のデータをリストに反映しますか？\n（現在のデータは上書きされます）`)) {
                        repertoire = data;
                        saveData();
                        renderRepertoire();
                        closeModal();
                        alert('データを更新しました！');
                    }
                } else {
                    alert('データ形式が正しくありません。\n各アイテムには少なくとも "title" と "duration" (秒数) が必要です。');
                }
            } else {
                alert('データ形式エラー: 配列（リスト）形式である必要があります。');
            }
        } catch (err) {
            console.error(err);
            alert('JSONの解析に失敗しました。コピーしたデータが正しいか確認してください。\n' + err.message);
        }
    }


    // --- Helper Functions ---

    function openModal(editIndex = null) {
        addSongModal.classList.remove('hidden');
        const idInput = document.getElementById('song-id');
        const titleInput = document.getElementById('song-title');
        const durationInput = document.getElementById('song-duration');
        const yearInput = document.getElementById('song-year');

        if (editIndex !== null) {
            // Edit Mode
            const song = repertoire[editIndex];
            modalTitle.textContent = "Edit Song";
            submitBtn.textContent = "Save Changes";
            idInput.value = song.id;
            titleInput.value = song.title;
            durationInput.value = formatTime(song.duration); // mm:ss
            yearInput.value = song.year || '';
        } else {
            // Add Mode
            modalTitle.textContent = "Add New Song";
            submitBtn.textContent = "Add Song";
            addSongForm.reset();
            idInput.value = "";
            yearInput.value = "";
        }

        titleInput.focus();
    }

    function closeModal() {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.add('hidden'));
    }

    function parseDuration(str) {
        const parts = str.split(':');
        if (parts.length === 2) {
            const min = parseInt(parts[0], 10);
            const sec = parseInt(parts[1], 10);
            if (!isNaN(min) && !isNaN(sec)) {
                return (min * 60) + sec;
            }
        }
        return 0;
    }

    function formatTime(totalSeconds, includeHours = false) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');

        if (includeHours && hours > 0) {
            const hh = String(hours).padStart(2, '0');
            return `${hh}:${mm}:${ss}`;
        }

        if (includeHours) {
            const hh = String(hours).padStart(2, '0');
            return `${hh}:${mm}:${ss}`;
        }

        return `${mm}:${ss}`;
    }

    function updateTotalTime() {
        // Safety check loop
        const totalSeconds = setlist.reduce((acc, song) => {
            if (!song || typeof song.duration !== 'number') return acc;
            return acc + song.duration;
        }, 0);
        totalTimeDisplay.textContent = formatTime(totalSeconds, true);
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    }

    // --- Save as Image ---
    const saveImageBtn = document.getElementById('save-image-btn');
    if (saveImageBtn) {
        saveImageBtn.addEventListener('click', handleSaveImage);
    }

    function handleSaveImage() {
        if (!setlist || setlist.length === 0) {
            alert('Setlist is empty!');
            return;
        }

        // Visual feedback
        const originalText = saveImageBtn.innerHTML;
        saveImageBtn.innerHTML = 'Generating...';

        // 1. Create a specialized container for capture (Clean DOM)
        const captureContainer = document.createElement('div');
        captureContainer.className = 'capture-container'; // For potential CSS targeting if needed

        // inline styles to ensure perfect "Print" layout
        Object.assign(captureContainer.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '800px', // Fixed Desktop Width
            backgroundColor: '#1e1e1e', // --surface-color
            color: '#ffffff', // --text-primary
            fontFamily: "'Outfit', sans-serif",
            padding: '40px',
            zIndex: '-9999',
            boxSizing: 'border-box' // Handle padding correctly
        });

        // 2. Build Header
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            borderBottom: '1px solid #333333', // --border-color
            paddingBottom: '20px'
        });

        const title = document.createElement('h2');
        title.textContent = 'Current Setlist';
        Object.assign(title.style, {
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem', // Slightly larger for image
            margin: '0',
            color: '#ffffff'
        });

        const timeDisplay = document.createElement('div');
        timeDisplay.innerHTML = `
            <span style="display:block; font-size:0.9rem; color:#b3b3b3; text-align:right;">TOTAL TIME</span>
            <span style="font-size:2rem; font-weight:700; color:#D4AF37; font-family:monospace;">${totalTimeDisplay.textContent}</span>
        `;

        header.appendChild(title);
        header.appendChild(timeDisplay);
        captureContainer.appendChild(header);

        // 3. Build List
        const listContainer = document.createElement('div');
        Object.assign(listContainer.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        });

        setlist.forEach((song, index) => {
            const card = document.createElement('div');
            // Replicate .song-card styles explicitly to avoid inheritance issues
            Object.assign(card.style, {
                backgroundColor: '#121212', // --bg-color
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid transparent'
            });

            // Replicate logic for year badge
            const yearBadge = song.year ?
                `<span style="
                    display:inline-block; 
                    background-color:#2d2d2d; 
                    color:#b3b3b3; 
                    font-size:0.9rem; 
                    padding:2px 8px; 
                    border-radius:4px; 
                    margin-left:10px; 
                    vertical-align:middle; 
                    border:1px solid #333333;">
                    ${song.year}
                </span>` : '';

            card.innerHTML = `
                <div style="flex:1;">
                    <span style="font-weight:600; font-size:1.2rem; display:block; margin-bottom:4px;">
                        ${index + 1}. ${escapeHtml(song.title)}
                    </span>
                    ${yearBadge}
                </div>
                <div style="font-family:monospace; font-size:1.1rem; color:#D4AF37; background:rgba(212,175,55,0.1); padding:4px 10px; border-radius:4px;">
                    ${formatTime(song.duration)}
                </div>
            `;
            listContainer.appendChild(card);
        });

        captureContainer.appendChild(listContainer);
        document.body.appendChild(captureContainer);

        // 4. Capture
        html2canvas(captureContainer, {
            backgroundColor: '#1e1e1e',
            scale: 2,
            useCORS: true,
            scrollY: 0,
            windowWidth: 1000,
            // Height is automatic because the container expands naturally in the DOM
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `setlist-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL();
            link.click();

            document.body.removeChild(captureContainer);
            saveImageBtn.innerHTML = originalText;
        }).catch(err => {
            console.error('Capture failed:', err);
            alert('Failed to save image.');
            if (document.body.contains(captureContainer)) document.body.removeChild(captureContainer);
            saveImageBtn.innerHTML = originalText;
        });
    }

    // --- Export Data ---
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = JSON.stringify(repertoire, null, 4); // Pretty print
            // Fallback for clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(data).then(() => {
                    alert('データをクリップボードにコピーしました！\n\napp.jsを開き、"loadData"関数内の初期データ（"Irish Blessing"などがある部分）を、このコピーしたデータで上書きしてください。\nその後、GitHubにプッシュすれば反映されます。');
                }).catch(err => {
                    console.error('Copy failed', err);
                    alert('コピーに失敗しました。コンソールを確認するか、以下のテキストをコピーしてください:\n' + data);
                });
            } else {
                alert('クリップボードAPIがサポートされていません。以下のデータをコピーしてください:\n' + data);
            }
        });
    }

});
