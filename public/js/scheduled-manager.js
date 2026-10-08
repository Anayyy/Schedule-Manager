(() => {
    const STORAGE_KEY = 'scheduled-manager-state-v1';
    const DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    const defaultSchedulesSemester3 = [
        { id: cryptoId(), name: 'Etika Profesi Teknologi Informasi', day: 'Kamis', start: '15:20', end: '17:00', room: 'C.004 VA', lecturer: 'Septi Andryana', className: 'R.01', sks: 2 },
        { id: cryptoId(), name: 'Arsitektur dan Organisasi Komputer', day: 'Rabu', start: '13:20', end: '15:50', room: 'Lab Networking Data&Cloud', lecturer: 'Gatot Soepriyono', className: 'R.02', sks: 3 },
        { id: cryptoId(), name: 'Perancangan dan Analisis Algoritma', day: 'Jumat', start: '09:50', end: '11:30', room: 'D.001 VA', lecturer: 'Aris Gunaryati', className: 'R.01', sks: 2 },
        { id: cryptoId(), name: 'Basis Data', day: 'Kamis', start: '08:00', end: '10:30', room: 'Lab Networking Data&Cloud', lecturer: 'Ariana Azimah', className: 'R.02', sks: 4 },
        { id: cryptoId(), name: 'Kecerdasan Artifisial', day: 'Jumat', start: '16:00', end: '18:30', room: 'D.402 VA', lecturer: 'Arie Gunawan', className: 'R.01', sks: 3 },
        { id: cryptoId(), name: 'Struktur Data dan Algoritma', day: 'Jumat', start: '13:20', end: '15:50', room: 'Lab Networking Data&Cloud', lecturer: 'Frenda Farahdinna', className: 'R.03', sks: 3 },
        { id: cryptoId(), name: 'Rekayasa Perangkat Lunak Informatika', day: 'Rabu', start: '10:40', end: '13:10', room: 'Lab. Data Science', lecturer: 'Lili Dwi Yulianto', className: 'R.01', sks: 3 },
        { id: cryptoId(), name: 'Data Science', day: 'Kamis', start: '10:40', end: '13:10', room: 'Lab Networking Data&Cloud', lecturer: 'Nur Hayati', className: 'R.01', sks: 4 },
    ];

    const defaultState = () => ({
        activeSemester: '3',
        selectedDay: 'Semua',
        taskStatusFilter: 'all',
        schedules: { '3': defaultSchedulesSemester3.map(item => ({ ...item, id: cryptoId() })) },
        tasks: [],
    });

    let state = loadState();

    const $ = (id) => document.getElementById(id);

    const elements = {
        semesterSelect: $('semesterSelect'),
        addSemesterBtn: $('addSemesterBtn'),
        resetDataBtn: $('resetDataBtn'),
        scheduleForm: $('scheduleForm'),
        taskForm: $('taskForm'),
        scheduleList: $('scheduleList'),
        taskList: $('taskList'),
        dayFilter: $('dayFilter'),
        taskCourse: $('taskCourse'),
        taskStatusFilter: $('taskStatusFilter'),
        scheduleSubtitle: $('scheduleSubtitle'),
        statSemester: $('statSemester'),
        statSks: $('statSks'),
        statTasks: $('statTasks'),
    };

    function cryptoId() {
        if (window.crypto?.randomUUID) return window.crypto.randomUUID();
        return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultState();
            const parsed = JSON.parse(raw);
            if (!parsed.schedules || !parsed.schedules['3']?.length) return defaultState();
            return {
                activeSemester: parsed.activeSemester || '3',
                selectedDay: parsed.selectedDay || 'Semua',
                taskStatusFilter: parsed.taskStatusFilter || 'all',
                schedules: parsed.schedules || { '3': defaultSchedulesSemester3 },
                tasks: parsed.tasks || [],
            };
        } catch (error) {
            console.warn('LocalStorage rusak, memakai data default.', error);
            return defaultState();
        }
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        syncToDatabaseQuietly();
    }

    async function syncToDatabaseQuietly() {
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.content;
            await fetch('/api/scheduled-manager/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { 'X-CSRF-TOKEN': token } : {}) },
                body: JSON.stringify({ activeSemester: state.activeSemester, schedules: state.schedules, tasks: state.tasks }),
            });
        } catch (error) {
            // Database bersifat opsional; localStorage tetap menjadi sumber utama.
        }
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, (char) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
        })[char]);
    }

    function formatDateTime(value) {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return escapeHtml(value);
        return date.toLocaleString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function activeSchedules() {
        return [...(state.schedules[state.activeSemester] || [])].sort((a, b) => {
            const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
            if (dayDiff !== 0) return dayDiff;
            return String(a.start).localeCompare(String(b.start));
        });
    }

    function renderSemesterOptions() {
        const semesters = Object.keys(state.schedules).sort((a, b) => Number(a) - Number(b));
        elements.semesterSelect.innerHTML = semesters.map((semester) => {
            const total = (state.schedules[semester] || []).length;
            const selected = semester === state.activeSemester ? 'selected' : '';
            return `<option value="${escapeHtml(semester)}" ${selected}>Semester ${escapeHtml(semester)} (${total} matkul)</option>`;
        }).join('');
    }

    function renderDayFilter() {
        const days = ['Semua', ...DAY_ORDER];
        elements.dayFilter.innerHTML = days.map((day) => {
            const active = day === state.selectedDay;
            const classes = active
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400';
            return `<button type="button" data-day="${day}" class="rounded-full border px-3 py-1 text-xs font-bold transition ${classes}">${day}</button>`;
        }).join('');
    }

    function renderStats() {
        const schedules = activeSchedules();
        const totalSks = schedules.reduce((sum, item) => sum + (Number(item.sks) || 0), 0);
        const openTasks = state.tasks.filter((task) => !task.done).length;
        elements.statSemester.textContent = state.activeSemester;
        elements.statSks.textContent = totalSks;
        elements.statTasks.textContent = `${openTasks}/${state.tasks.length}`;
        elements.scheduleSubtitle.textContent = `Semester ${state.activeSemester} • ${schedules.length} mata kuliah • ${totalSks} SKS`;
    }

    function renderSchedules() {
        const schedules = activeSchedules().filter((item) => state.selectedDay === 'Semua' || item.day === state.selectedDay);
        if (!schedules.length) {
            elements.scheduleList.innerHTML = `<div class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center md:col-span-2">
                <p class="font-bold text-slate-700">Belum ada jadwal pada filter ini</p>
                <p class="mt-1 text-sm text-slate-500">Tambahkan lewat formulir di samping atau ubah filter hari.</p>
            </div>`;
            return;
        }

        elements.scheduleList.innerHTML = schedules.map((item) => `
            <article class="flex flex-col rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm">
                <div class="mb-3 flex items-center justify-between gap-2">
                    <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">${escapeHtml(item.day)}</span>
                    <span class="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">${escapeHtml(item.sks)} SKS</span>
                </div>
                <h3 class="font-bold leading-6 text-slate-950">${escapeHtml(item.name)}</h3>
                <p class="mt-1 text-sm font-semibold text-sky-700">${escapeHtml(item.start)} - ${escapeHtml(item.end)}</p>
                <dl class="mt-3 space-y-1 text-xs text-slate-500">
                    <div class="flex gap-2"><dt class="w-14 shrink-0 font-bold">Dosen</dt><dd>${escapeHtml(item.lecturer)}</dd></div>
                    <div class="flex gap-2"><dt class="w-14 shrink-0 font-bold">Ruang</dt><dd>${escapeHtml(item.room)}</dd></div>
                    <div class="flex gap-2"><dt class="w-14 shrink-0 font-bold">Kelas</dt><dd>${escapeHtml(item.className)}</dd></div>
                </dl>
                <button type="button" data-delete-schedule="${escapeHtml(item.id)}" class="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100">Hapus Jadwal</button>
            </article>`).join('');
    }

    function renderCourseOptions() {
        const courses = activeSchedules().map((c) => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)} (${escapeHtml(c.className)})</option>`);
        elements.taskCourse.innerHTML = courses.join('') || '<option value="">Belum ada mata kuliah</option>';
    }

    function taskUrgency(deadline, done) {
        if (done) return { label: 'Selesai', cls: 'bg-slate-900 text-white' };
        const diff = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24);
        if (Number.isNaN(diff) || diff <= 1) return { label: 'Merah: lewat/sisa 1 hari', cls: 'bg-red-100 text-red-700 border-red-200' };
        if (diff <= 3) return { label: 'Kuning: sisa 3 hari', cls: 'bg-amber-100 text-amber-800 border-amber-200' };
        return { label: 'Hijau: masih aman', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    }

    function renderTasks() {
        const sorted = [...state.tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        const filtered = sorted.filter((task) => {
            if (state.taskStatusFilter === 'done') return task.done;
            if (state.taskStatusFilter === 'active') return !task.done;
            return true;
        });
        if (!filtered.length) {
            elements.taskList.innerHTML = `<div class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p class="font-bold text-slate-700">Belum ada tugas pada filter ini</p>
                <p class="mt-1 text-sm text-slate-500">Tambahkan tugas baru dan tugas akan diurutkan otomatis berdasarkan deadline terdekat.</p>
            </div>`;
            return;
        }
        elements.taskList.innerHTML = filtered.map((task) => {
            const badge = taskUrgency(task.deadline, task.done);
            const checked = task.done ? 'checked' : '';
            const titleCls = task.done ? 'line-through opacity-60' : '';
            return `<article class="flex gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                <input type="checkbox" ${checked} data-toggle-task="${escapeHtml(task.id)}" class="task-check mt-1" aria-label="Tandai selesai">
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                        <h3 class="font-bold text-slate-950 ${titleCls}">${escapeHtml(task.title)}</h3>
                        <span class="rounded-full border px-2.5 py-1 text-xs font-bold ${badge.cls}">${badge.label}</span>
                    </div>
                    <p class="mt-1 text-xs font-semibold text-sky-700">${escapeHtml(task.courseName)} - ${formatDateTime(task.deadline)}</p>
                    <p class="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">${escapeHtml(task.description || '-')}</p>
                    <div class="mt-3 flex flex-wrap gap-2">
                        <button type="button" data-delete-task="${escapeHtml(task.id)}" class="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100">Hapus</button>
                        <span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">ID: ${escapeHtml(task.id.slice(0, 8))}</span>
                    </div>
                </div>
            </article>`;
        }).join('');
    }

    function renderAll() {
        renderSemesterOptions();
        renderDayFilter();
        renderStats();
        renderSchedules();
        renderCourseOptions();
        renderTasks();
    }

    function bindEvents() {
        // Semester change
        elements.semesterSelect.addEventListener('change', () => {
            state.activeSemester = elements.semesterSelect.value;
            state.selectedDay = 'Semua';
            saveState();
            renderAll();
        });

        // Add semester
        elements.addSemesterBtn.addEventListener('click', () => {
            const name = prompt('Nama semester baru (contoh: Semester 5):', `Semester ${Number(state.activeSemester) + 1}`);
            if (!name) return;
            const num = name.match(/\d+$/)?.[0];
            if (!num) return alert('Nama harus mengandung nomor semester.');
            if (state.schedules[num]) return alert('Semester tersebut sudah ada.');
            state.schedules[num] = [];
            state.activeSemester = num;
            state.selectedDay = 'Semua';
            saveState();
            renderAll();
        });

        // Reset data
        elements.resetDataBtn.addEventListener('click', () => {
            if (!confirm('Mengembalikan ke data awal Semester 3? Semua perubahan lokal akan hilang.')) return;
            localStorage.removeItem(STORAGE_KEY);
            state = defaultState();
            renderAll();
        });

        // Day filter
        elements.dayFilter.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-day]');
            if (!btn) return;
            state.selectedDay = btn.dataset.day;
            saveState();
            renderDayFilter();
            renderSchedules();
        });

        // Schedule form
        elements.scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const course = {
                id: cryptoId(),
                name: $('courseName').value.trim(),
                day: $('courseDay').value,
                start: $('courseStart').value,
                end: $('courseEnd').value,
                room: $('courseRoom').value.trim(),
                className: $('courseClass').value.trim(),
                lecturer: $('courseLecturer').value.trim(),
                sks: Number($('courseSks').value),
            };
            if (!course.name || !course.day || !course.start || !course.end || !course.room || !course.className || !course.lecturer || !course.sks) {
                return alert('Semua kolom wajib diisi.');
            }
            if (course.end <= course.start) {
                return alert('Jam selesai harus lebih besar dari jam mulai.');
            }
            state.schedules[state.activeSemester].push(course);
            saveState();
            elements.scheduleForm.reset();
            renderAll();
        });

        // Task form
        elements.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = $('taskName').value.trim();
            const courseName = $('taskCourse').value;
            const description = $('taskDescription').value.trim();
            const deadline = $('taskDeadline').value;
            if (!title || !courseName || !deadline) return alert('Nama tugas, mata kuliah, dan deadline wajib diisi.');
            const task = {
                id: cryptoId(),
                title,
                courseName,
                description,
                deadline,
                done: false,
                semester: state.activeSemester,
            };
            state.tasks.push(task);
            saveState();
            elements.taskForm.reset();
            renderTasks();
            renderStats();
        });

        // Task status filter
        elements.taskStatusFilter.addEventListener('change', () => {
            state.taskStatusFilter = elements.taskStatusFilter.value;
            saveState();
            renderTasks();
        });

        // Delegation on task list
        elements.taskList.addEventListener('change', (e) => {
            const checkbox = e.target.closest('[data-toggle-task]');
            if (!checkbox) return;
            const id = checkbox.dataset.toggleTask;
            const task = state.tasks.find((t) => t.id === id);
            if (task) {
                task.done = checkbox.checked;
                saveState();
                renderTasks();
                renderStats();
            }
        });

        elements.taskList.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-delete-task]');
            if (!btn) return;
            const id = btn.dataset.deleteTask;
            if (confirm('Hapus tugas ini?')) {
                state.tasks = state.tasks.filter((t) => t.id !== id);
                saveState();
                renderTasks();
                renderStats();
            }
        });

        // Delegation on schedule list
        elements.scheduleList.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-delete-schedule]');
            if (!btn) return;
            const id = btn.dataset.deleteSchedule;
            if (confirm('Hapus jadwal ini?')) {
                state.schedules[state.activeSemester] = state.schedules[state.activeSemester].filter((s) => s.id !== id);
                saveState();
                renderAll();
            }
        });
    }

    // Init
    renderAll();
    bindEvents();
})();

