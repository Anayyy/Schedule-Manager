<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Scheduled Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'] },
                    colors: {
                        navy: '#0f172a',
                        ocean: '#0f766e',
                        skyTech: '#0369a1',
                        slateSoft: '#f8fafc'
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/scheduled-manager.css') }}">
</head>
<body class="min-h-screen bg-slate-100 font-sans text-slate-800">
    <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.16),_transparent_30%)]">
        <header class="border-b border-white/70 bg-white/80 backdrop-blur-xl">
            <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div>
                    <p class="mb-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-teal-700 ring-1 ring-teal-100">Informatika Universitas Nasional</p>
                    <h1 class="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Scheduled Manager</h1>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Asisten akademik untuk Octiyana Fa'iz Surya Permana (Anayyy): kelola jadwal kuliah, tugas, dan reminder deadline secara rapi.</p>
                </div>
                <div class="grid grid-cols-3 gap-3 rounded-3xl border border-white/80 bg-white/75 p-3 shadow-sm">
                    <div class="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                        <p class="text-xs text-slate-500">Semester</p>
                        <p id="statSemester" class="text-lg font-bold text-slate-950">3</p>
                    </div>
                    <div class="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                        <p class="text-xs text-slate-500">SKS</p>
                        <p id="statSks" class="text-lg font-bold text-sky-700">0</p>
                    </div>
                    <div class="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                        <p class="text-xs text-slate-500">Tugas</p>
                        <p id="statTasks" class="text-lg font-bold text-teal-700">0</p>
                    </div>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <section class="mb-8 grid gap-4 rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                    <label for="semesterSelect" class="mb-2 block text-sm font-semibold text-slate-700">Pilih Semester Aktif</label>
                    <div class="flex flex-col gap-3 sm:flex-row">
                        <select id="semesterSelect" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:max-w-xs"></select>
                        <button id="addSemesterBtn" type="button" class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">+ Tambah Semester</button>
                    </div>
                    <p class="mt-2 text-xs text-slate-500">Data disimpan otomatis di localStorage browser. Jika kosong, Semester 3 akan dimuat otomatis.</p>
                </div>
                <button id="resetDataBtn" type="button" class="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100">Reset Data Default</button>
            </section>

            <section class="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
                <div class="space-y-6">
                    <div class="rounded-[2rem] border border-white/80 bg-white p-5 shadow-sm">
                        <div class="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 class="text-xl font-bold text-slate-950">Tambah Jadwal Kuliah</h2>
                                <p class="mt-1 text-sm text-slate-500">Form jadwal berbasis semester.</p>
                            </div>
                            <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">Kuliah</span>
                        </div>
                        <form id="scheduleForm" class="grid gap-4">
                            <div>
                                <label class="form-label" for="courseName">Nama Mata Kuliah</label>
                                <input id="courseName" required class="form-input" placeholder="Contoh: Basis Data">
                            </div>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label class="form-label" for="courseDay">Hari</label>
                                    <select id="courseDay" required class="form-input">
                                        <option>Senin</option><option>Selasa</option><option>Rabu</option><option>Kamis</option><option>Jumat</option><option>Sabtu</option><option>Minggu</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label" for="courseSks">SKS</label>
                                    <input id="courseSks" required type="number" min="1" max="8" class="form-input" placeholder="3">
                                </div>
                            </div>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label class="form-label" for="courseStart">Jam Mulai</label>
                                    <input id="courseStart" required type="time" class="form-input">
                                </div>
                                <div>
                                    <label class="form-label" for="courseEnd">Jam Selesai</label>
                                    <input id="courseEnd" required type="time" class="form-input">
                                </div>
                            </div>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label class="form-label" for="courseRoom">Ruangan</label>
                                    <input id="courseRoom" required class="form-input" placeholder="Lab. Data Science">
                                </div>
                                <div>
                                    <label class="form-label" for="courseClass">Kelas</label>
                                    <input id="courseClass" required class="form-input" placeholder="R.01">
                                </div>
                            </div>
                            <div>
                                <label class="form-label" for="courseLecturer">Dosen</label>
                                <input id="courseLecturer" required class="form-input" placeholder="Nama dosen pengampu">
                            </div>
                            <button class="rounded-2xl bg-sky-700 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-sky-800" type="submit">Simpan Jadwal</button>
                        </form>
                    </div>

                    <div class="rounded-[2rem] border border-white/80 bg-white p-5 shadow-sm">
                        <div class="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 class="text-xl font-bold text-slate-950">Tambah Tugas</h2>
                                <p class="mt-1 text-sm text-slate-500">Deadline diurutkan otomatis dari yang paling dekat.</p>
                            </div>
                            <span class="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">Reminder</span>
                        </div>
                        <form id="taskForm" class="grid gap-4">
                            <div>
                                <label class="form-label" for="taskName">Nama Tugas</label>
                                <input id="taskName" required class="form-input" placeholder="Contoh: Laporan praktikum">
                            </div>
                            <div>
                                <label class="form-label" for="taskCourse">Mata Kuliah</label>
                                <select id="taskCourse" required class="form-input"></select>
                            </div>
                            <div>
                                <label class="form-label" for="taskDescription">Deskripsi</label>
                                <textarea id="taskDescription" rows="3" class="form-input resize-none" placeholder="Catatan, instruksi dosen, atau tautan referensi..."></textarea>
                            </div>
                            <div>
                                <label class="form-label" for="taskDeadline">Deadline</label>
                                <input id="taskDeadline" required type="datetime-local" class="form-input">
                            </div>
                            <button class="rounded-2xl bg-teal-700 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-teal-800" type="submit">Simpan Tugas</button>
                        </form>
                    </div>
                </div>
                <div class="space-y-6">
                    <section class="rounded-[2rem] border border-white/80 bg-white p-5 shadow-sm">
                        <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 class="text-xl font-bold text-slate-950">Jadwal Kuliah</h2>
                                <p id="scheduleSubtitle" class="mt-1 text-sm text-slate-500">Semester aktif</p>
                            </div>
                            <div id="dayFilter" class="flex flex-wrap gap-2"></div>
                        </div>
                        <div id="scheduleList" class="grid gap-4 md:grid-cols-2"></div>
                    </section>

                    <section class="rounded-[2rem] border border-white/80 bg-white p-5 shadow-sm">
                        <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 class="text-xl font-bold text-slate-950">Daftar Tugas</h2>
                                <p class="mt-1 text-sm text-slate-500">Merah: lewat/sisa 1 hari, kuning: sisa 3 hari, hijau: masih aman.</p>
                            </div>
                            <select id="taskStatusFilter" class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100">
                                <option value="all">Semua Tugas</option>
                                <option value="active">Belum Selesai</option>
                                <option value="done">Selesai</option>
                            </select>
                        </div>
                        <div id="taskList" class="space-y-3"></div>
                    </section>
                </div>
            </section>
        </main>

        <footer class="mx-auto max-w-7xl px-4 pb-8 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
            Dibuat sebagai SPA akademik dengan Laravel Blade, JavaScript, Tailwind CSS CDN, dan localStorage.
        </footer>
    </div>

    <script src="{{ asset('js/scheduled-manager.js') }}"></script>
</body>
</html>
