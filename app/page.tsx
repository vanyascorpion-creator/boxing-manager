"use client";

import { ChangeEvent, useEffect, useState } from "react";

type Fighter = {
  id: number;
  name: string;
  age: number;
  height: number;
  weight: number;
  wins: number;
  losses: number;
  draws: number;
  photo: string;
  notes: string;
};

type Fight = {
  id: number;
  fighter: string;
  opponent: string;
  date: string;
  weight: string;
  location: string;
  result: "Не определён" | "Победа" | "Поражение" | "Ничья";
  method: string;
  round: string;
  notes: string;
  photo: string;
  video: string;
};

type Note = {
  id: number;
  title: string;
  text: string;
  date: string;
};

const resultOptions = [
  "Не определён",
  "Победа",
  "Поражение",
  "Ничья",
];

const methodOptions = [
  "Не определён",
  "KO",
  "TKO",
  "Решение судей",
  "Единогласное решение",
  "Раздельное решение",
  "Техническое решение",
  "Снятие",
  "Дисквалификация",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("fighters");

  const [fighters, setFighters] = useState<Fighter[]>([]);
  useEffect(() => {
  async function loadFighters() {
    const response = await fetch("/api/fighters");
    const data = await response.json();

    setFighters(data);
  }

  loadFighters();
}, []);
  const [fights, setFights] = useState<Fight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [selectedFighterId, setSelectedFighterId] = useState<number | null>(
    null
  );

  const [selectedFightId, setSelectedFightId] = useState<number | null>(null);

  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  const [isFighterModalOpen, setIsFighterModalOpen] = useState(false);
  const [isFightModalOpen, setIsFightModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const [fighterName, setFighterName] = useState("");
  const [fighterAge, setFighterAge] = useState("");
  const [fighterHeight, setFighterHeight] = useState("");
  const [fighterWeight, setFighterWeight] = useState("");

  const [fightFighter, setFightFighter] = useState("");
  const [fightOpponent, setFightOpponent] = useState("");
  const [fightDate, setFightDate] = useState("");
  const [fightWeight, setFightWeight] = useState("");
  const [fightLocation, setFightLocation] = useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");

  const selectedFighter = fighters.find(
    (fighter) => fighter.id === selectedFighterId
  );

  const selectedFight = fights.find(
    (fight) => fight.id === selectedFightId
  );

  const selectedNote = notes.find(
    (note) => note.id === selectedNoteId
  );

async function addFighter() {
  if (!fighterName || !fighterAge || !fighterHeight || !fighterWeight) {
    return;
  }

  const response = await fetch("/api/fighters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: fighterName,
      age: Number(fighterAge),
      height: Number(fighterHeight),
      weight: Number(fighterWeight),
    }),
  });

  const data = await response.json();

  console.log("API response:", data);

  const newFighter: Fighter = {
    id: data.id,
    name: data.name,
    age: data.age,
    height: data.height,
    weight: data.weight,
    wins: data.wins,
    losses: data.losses,
    draws: data.draws,
    photo: data.photo,
    notes: data.notes,
  };

  setFighters((current) => [newFighter, ...current]);

  setFighterName("");
  setFighterAge("");
  setFighterHeight("");
  setFighterWeight("");

  setIsFighterModalOpen(false);
}

  function addFight() {
    if (
      !fightFighter ||
      !fightOpponent ||
      !fightDate ||
      !fightWeight ||
      !fightLocation
    ) {
      return;
    }

    const newFight: Fight = {
      id: Date.now(),
      fighter: fightFighter,
      opponent: fightOpponent,
      date: fightDate,
      weight: fightWeight,
      location: fightLocation,
      result: "Не определён",
      method: "Не определён",
      round: "",
      notes: "",
      photo: "",
      video: "",
    };

    setFights((current) => [...current, newFight]);

    setFightFighter("");
    setFightOpponent("");
    setFightDate("");
    setFightWeight("");
    setFightLocation("");

    setIsFightModalOpen(false);
  }

  function addNote() {
    if (!noteTitle || !noteText) {
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: noteTitle,
      text: noteText,
      date: new Date().toLocaleDateString("ru-RU"),
    };

    setNotes((current) => [...current, newNote]);

    setNoteTitle("");
    setNoteText("");

    setIsNoteModalOpen(false);
  }

  function updateFighter(
    id: number,
    field: keyof Fighter,
    value: string | number
  ) {
    setFighters((current) =>
      current.map((fighter) =>
        fighter.id === id
          ? { ...fighter, [field]: value }
          : fighter
      )
    );
  }

  function updateFight(
    id: number,
    field: keyof Fight,
    value: string
  ) {
    setFights((current) =>
      current.map((fight) =>
        fight.id === id
          ? { ...fight, [field]: value }
          : fight
      )
    );
  }

  function updateNote(
    id: number,
    field: keyof Note,
    value: string
  ) {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? { ...note, [field]: value }
          : note
      )
    );
  }

  function addRecord(
    id: number,
    type: "wins" | "losses" | "draws"
  ) {
    setFighters((current) =>
      current.map((fighter) =>
        fighter.id === id
          ? {
              ...fighter,
              [type]: fighter[type] + 1,
            }
          : fighter
      )
    );
  }

  function deleteFighter(id: number) {
    setFighters((current) =>
      current.filter((fighter) => fighter.id !== id)
    );

    setSelectedFighterId(null);
  }

  function deleteFight(id: number) {
    setFights((current) =>
      current.filter((fight) => fight.id !== id)
    );

    setSelectedFightId(null);
  }

  function deleteNote(id: number) {
    setNotes((current) =>
      current.filter((note) => note.id !== id)
    );

    setSelectedNoteId(null);
  }

  function handleFighterPhoto(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || selectedFighterId === null) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateFighter(
        selectedFighterId,
        "photo",
        String(reader.result)
      );
    };

    reader.readAsDataURL(file);
  }

  function handleFightPhoto(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || selectedFightId === null) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateFight(
        selectedFightId,
        "photo",
        String(reader.result)
      );
    };

    reader.readAsDataURL(file);
  }

  function handleFightVideo(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || selectedFightId === null) {
      return;
    }

    const videoUrl = URL.createObjectURL(file);

    updateFight(
      selectedFightId,
      "video",
      videoUrl
    );
  }

  function closeAllDetails() {
    setSelectedFighterId(null);
    setSelectedFightId(null);
    setSelectedNoteId(null);
  }

  /*
   * FIGHTER PROFILE
   */

  if (selectedFighter) {
    return (
      <main className="min-h-screen bg-[#0b0d10] text-white">
        <div className="mx-auto max-w-5xl px-6 py-8">

          <button
            onClick={() => setSelectedFighterId(null)}
            className="mb-8 text-sm text-zinc-500 transition hover:text-white"
          >
            ← Назад к бойцам
          </button>

          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-zinc-800 text-4xl font-bold">
              {selectedFighter.photo ? (
                <img
                  src={selectedFighter.photo}
                  alt={selectedFighter.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                selectedFighter.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
              )}
            </div>

            <div>
              <div className="mb-2 text-sm uppercase tracking-[0.25em] text-red-500">
                Fighter profile
              </div>

              <h1 className="text-4xl font-bold">
                {selectedFighter.name}
              </h1>

              <p className="mt-2 text-zinc-500">
                {selectedFighter.age} лет ·{" "}
                {selectedFighter.height} см ·{" "}
                {selectedFighter.weight} кг
              </p>
            </div>
          </div>

          {/* RECORD */}

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-[#111419] p-6 text-center">
              <p className="text-sm text-zinc-500">
                Победы
              </p>

              <p className="mt-3 text-4xl font-bold text-green-500">
                {selectedFighter.wins}
              </p>

              <button
                onClick={() =>
                  addRecord(selectedFighter.id, "wins")
                }
                className="mt-4 rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-500 transition hover:bg-green-500/20"
              >
                + Победа
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#111419] p-6 text-center">
              <p className="text-sm text-zinc-500">
                Поражения
              </p>

              <p className="mt-3 text-4xl font-bold text-red-500">
                {selectedFighter.losses}
              </p>

              <button
                onClick={() =>
                  addRecord(selectedFighter.id, "losses")
                }
                className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500 transition hover:bg-red-500/20"
              >
                + Поражение
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#111419] p-6 text-center">
              <p className="text-sm text-zinc-500">
                Ничьи
              </p>

              <p className="mt-3 text-4xl font-bold">
                {selectedFighter.draws}
              </p>

              <button
                onClick={() =>
                  addRecord(selectedFighter.id, "draws")
                }
                className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700"
              >
                + Ничья
              </button>
            </div>
          </div>

          {/* FIGHTER DATA */}

          <section className="mt-8 rounded-2xl border border-zinc-800 bg-[#111419] p-6">
            <h2 className="text-2xl font-bold">
              Данные бойца
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Имя
                </label>

                <input
                  value={selectedFighter.name}
                  onChange={(e) =>
                    updateFighter(
                      selectedFighter.id,
                      "name",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Возраст
                </label>

                <input
                  type="number"
                  value={selectedFighter.age}
                  onChange={(e) =>
                    updateFighter(
                      selectedFighter.id,
                      "age",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Рост, см
                </label>

                <input
                  type="number"
                  value={selectedFighter.height}
                  onChange={(e) =>
                    updateFighter(
                      selectedFighter.id,
                      "height",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Вес, кг
                </label>

                <input
                  type="number"
                  value={selectedFighter.weight}
                  onChange={(e) =>
                    updateFighter(
                      selectedFighter.id,
                      "weight",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

            </div>
          </section>

          {/* FIGHTER PHOTO */}

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-[#111419] p-6">
            <h2 className="text-2xl font-bold">
              Фотография
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Добавь или замени фотографию бойца
            </p>

            <label className="mt-6 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-[#0b0d10] p-8 text-sm text-zinc-500 transition hover:border-red-600 hover:text-white">
              Выбрать фотографию

              <input
                type="file"
                accept="image/*"
                onChange={handleFighterPhoto}
                className="hidden"
              />
            </label>
          </section>

          {/* FIGHTER NOTES */}

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-[#111419] p-6">
            <h2 className="text-2xl font-bold">
              Заметки о бойце
            </h2>

            <textarea
              value={selectedFighter.notes}
              onChange={(e) =>
                updateFighter(
                  selectedFighter.id,
                  "notes",
                  e.target.value
                )
              }
              placeholder="Тактика, сильные стороны, слабые стороны, особенности тренировок..."
              rows={7}
              className="mt-5 w-full resize-none rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 leading-6 outline-none placeholder:text-zinc-600 focus:border-red-600"
            />
          </section>

          {/* DELETE FIGHTER */}

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Удалить этого бойца?"
                )
              ) {
                deleteFighter(selectedFighter.id);
              }
            }}
            className="mt-6 rounded-xl border border-red-900 px-5 py-3 text-sm text-red-500 transition hover:bg-red-950"
          >
            Удалить бойца
          </button>

        </div>
      </main>
    );
  }

  /*
   * FIGHT PROFILE
   */

  if (selectedFight) {
    return (
      <main className="min-h-screen bg-[#0b0d10] text-white">
        <div className="mx-auto max-w-5xl px-6 py-8">

          <button
            onClick={() => setSelectedFightId(null)}
            className="mb-8 text-sm text-zinc-500 transition hover:text-white"
          >
            ← Назад к поединкам
          </button>

          <div className="mb-8">
            <div className="text-sm uppercase tracking-[0.25em] text-red-500">
              Fight
            </div>

            <h1 className="mt-2 text-4xl font-bold">
              {selectedFight.fighter}
              <span className="mx-4 text-zinc-700">
                VS
              </span>
              {selectedFight.opponent}
            </h1>

            <p className="mt-3 text-zinc-500">
              {selectedFight.date} ·{" "}
              {selectedFight.weight} ·{" "}
              {selectedFight.location}
            </p>
          </div>

          {/* RESULT */}

          <section className="rounded-2xl border border-zinc-800 bg-[#111419] p-6">
            <h2 className="text-2xl font-bold">
              Результат
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Результат
                </label>

                <select
                  value={selectedFight.result}
                  onChange={(e) =>
                    updateFight(
                      selectedFight.id,
                      "result",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                >
                  {resultOptions.map((option) => (
                    <option key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Способ
                </label>

                <select
                  value={selectedFight.method}
                  onChange={(e) =>
                    updateFight(
                      selectedFight.id,
                      "method",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                >
                  {methodOptions.map((option) => (
                    <option key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Раунд
                </label>

                <input
                  value={selectedFight.round}
                  onChange={(e) =>
                    updateFight(
                      selectedFight.id,
                      "round",
                      e.target.value
                    )
                  }
                  placeholder="Например: 3"
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none placeholder:text-zinc-600 focus:border-red-600"
                />
              </div>

            </div>
          </section>

          {/* FIGHT DATA */}

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-[#111419] p-6">
            <h2 className="text-2xl font-bold">
              Данные поединка
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Боец
                </label>

                <input
                  value={selectedFight.fighter}
                  onChange={(e) =>
                    updateFight(
                      selectedFight.id,
                      "fighter",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Соперник
                </label>

                <input
                  value={selectedFight.opponent}
                  onChange={(e) =>
                    updateFight(
                      selectedFight.id,
                      "opponent",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Дата
                </label>

                <input
                  type="date"
                  value={selectedFight.date}
                  onChange={(e) =>
                    updateFight(
                      selectedFight.id,
                      "date",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  Весовая категория
                </label>

                <input
                  value={selectedFight.weight}
                  onChange={(e) =>
                    updateFight(
                      selectedFight.id,
                      "weight",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-zinc-500">
                  Место
                </label>

                <input
                  value={selectedFight.location}
                  onChange={(e) =>
                    updateFight(
                      selectedFight.id,
                      "location",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

            </div>
          </section>

          {/* FIGHT NOTES */}

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-[#111419] p-6">
            <h2 className="text-2xl font-bold">
              Заметки по поединку
            </h2>

            <textarea
              value={selectedFight.notes}
              onChange={(e) =>
                updateFight(
                  selectedFight.id,
                  "notes",
                  e.target.value
                )
              }
              placeholder="Как прошёл бой, тактика, ошибки, выводы..."
              rows={7}
              className="mt-5 w-full resize-none rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 leading-6 outline-none placeholder:text-zinc-600 focus:border-red-600"
            />
          </section>

          {/* MEDIA */}

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-[#111419] p-6">
            <h2 className="text-2xl font-bold">
              Фото и видео
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-[#0b0d10] p-8 text-center text-sm text-zinc-500 transition hover:border-red-600 hover:text-white">
                📷 Добавить фото

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFightPhoto}
                  className="hidden"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-[#0b0d10] p-8 text-center text-sm text-zinc-500 transition hover:border-red-600 hover:text-white">
                🎥 Добавить видео

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFightVideo}
                  className="hidden"
                />
              </label>

            </div>

            {selectedFight.photo && (
              <div className="mt-6 overflow-hidden rounded-xl">
                <img
                  src={selectedFight.photo}
                  alt="Фото поединка"
                  className="max-h-[500px] w-full object-contain"
                />
              </div>
            )}

            {selectedFight.video && (
              <div className="mt-6 overflow-hidden rounded-xl">
                <video
                  src={selectedFight.video}
                  controls
                  className="max-h-[500px] w-full"
                />
              </div>
            )}
          </section>

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Удалить этот поединок?"
                )
              ) {
                deleteFight(selectedFight.id);
              }
            }}
            className="mt-6 rounded-xl border border-red-900 px-5 py-3 text-sm text-red-500 transition hover:bg-red-950"
          >
            Удалить поединок
          </button>

        </div>
      </main>
    );
  }

  /*
   * NOTE PROFILE
   */

  if (selectedNote) {
    return (
      <main className="min-h-screen bg-[#0b0d10] text-white">
        <div className="mx-auto max-w-4xl px-6 py-8">

          <button
            onClick={() => setSelectedNoteId(null)}
            className="mb-8 text-sm text-zinc-500 transition hover:text-white"
          >
            ← Назад к заметкам
          </button>

          <div className="rounded-2xl border border-zinc-800 bg-[#111419] p-8">

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.25em] text-red-500">
                  Note
                </div>

                <h1 className="mt-2 text-3xl font-bold">
                  Заметка
                </h1>

                <p className="mt-2 text-sm text-zinc-600">
                  Создана {selectedNote.date}
                </p>
              </div>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Удалить эту заметку?"
                    )
                  ) {
                    deleteNote(selectedNote.id);
                  }
                }}
                className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-500 transition hover:bg-red-950"
              >
                Удалить
              </button>
            </div>

            <div className="mt-8">

              <label className="mb-2 block text-sm text-zinc-500">
                Заголовок
              </label>

              <input
                value={selectedNote.title}
                onChange={(e) =>
                  updateNote(
                    selectedNote.id,
                    "title",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 text-xl font-semibold outline-none focus:border-red-600"
              />

            </div>

            <div className="mt-6">

              <label className="mb-2 block text-sm text-zinc-500">
                Текст
              </label>

              <textarea
                value={selectedNote.text}
                onChange={(e) =>
                  updateNote(
                    selectedNote.id,
                    "text",
                    e.target.value
                  )
                }
                rows={14}
                className="w-full resize-none rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 leading-7 outline-none focus:border-red-600"
              />

            </div>

          </div>
        </div>
      </main>
    );
  }

  /*
   * MAIN DASHBOARD
   */

  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* HEADER */}

        <header className="mb-10 flex items-center justify-between">
          <div>
            <div className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-red-500">
              Boxing Manager
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="mt-2 text-zinc-500">
              Управление бойцами и спортивной карьерой
            </p>
          </div>

          {activeTab === "fighters" && (
            <button
              onClick={() => setIsFighterModalOpen(true)}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
            >
              + Добавить бойца
            </button>
          )}

          {activeTab === "fights" && (
            <button
              onClick={() => setIsFightModalOpen(true)}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
            >
              + Добавить поединок
            </button>
          )}

          {activeTab === "notes" && (
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
            >
              + Добавить заметку
            </button>
          )}
        </header>

        {/* NAVIGATION */}

        <nav className="mb-8 flex gap-2 border-b border-zinc-800 pb-3">
          <button
            onClick={() => {
              closeAllDetails();
              setActiveTab("fighters");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "fighters"
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            Бойцы
          </button>

          <button
            onClick={() => {
              closeAllDetails();
              setActiveTab("fights");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "fights"
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            Поединки
          </button>

          <button
            onClick={() => {
              closeAllDetails();
              setActiveTab("notes");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "notes"
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            Заметки
          </button>
        </nav>

        {/* ================= FIGHTERS ================= */}

        {activeTab === "fighters" && (
          <>
            <section className="mb-10 grid gap-4 md:grid-cols-4">

              <div className="rounded-2xl border border-zinc-800 bg-[#111419] p-6">
                <p className="text-sm text-zinc-500">
                  Всего бойцов
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {fighters.length}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#111419] p-6">
                <p className="text-sm text-zinc-500">
                  Побед
                </p>

                <p className="mt-3 text-3xl font-bold text-green-500">
                  {fighters.reduce(
                    (sum, fighter) => sum + fighter.wins,
                    0
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#111419] p-6">
                <p className="text-sm text-zinc-500">
                  Поражений
                </p>

                <p className="mt-3 text-3xl font-bold text-red-500">
                  {fighters.reduce(
                    (sum, fighter) => sum + fighter.losses,
                    0
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#111419] p-6">
                <p className="text-sm text-zinc-500">
                  Поединков
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {fights.length}
                </p>
              </div>

            </section>

            <section>

              <div className="mb-5">
                <h2 className="text-2xl font-bold">
                  Бойцы
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Текущий состав команды
                </p>
              </div>

              {fighters.length === 0 ? (
                <EmptyState
                  icon="🥊"
                  title="Пока нет бойцов"
                  text="Добавь первого бойца, чтобы начать вести его статистику и историю поединков."
                  buttonText="Добавить первого бойца"
                  onClick={() => setIsFighterModalOpen(true)}
                />
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                  {fighters.map((fighter) => (
                    <button
                      key={fighter.id}
                      onClick={() =>
                        setSelectedFighterId(fighter.id)
                      }
                      className="group rounded-2xl border border-zinc-800 bg-[#111419] p-6 text-left transition hover:-translate-y-1 hover:border-red-600"
                    >
                      <div className="mb-6 flex items-start justify-between">

                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-zinc-800 text-xl font-bold">

                          {fighter.photo ? (
                            <img
                              src={fighter.photo}
                              alt={fighter.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            fighter.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                          )}

                        </div>

                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                          Active
                        </span>

                      </div>

                      <h3 className="text-xl font-bold">
                        {fighter.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {fighter.age} лет · {fighter.weight} кг
                      </p>

                      <div className="my-6 h-px bg-zinc-800" />

                      <div className="grid grid-cols-3 gap-3 text-center">

                        <div>
                          <p className="text-xs text-zinc-600">
                            Победы
                          </p>

                          <p className="mt-1 text-xl font-bold text-green-500">
                            {fighter.wins}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-600">
                            Поражения
                          </p>

                          <p className="mt-1 text-xl font-bold text-red-500">
                            {fighter.losses}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-600">
                            Ничьи
                          </p>

                          <p className="mt-1 text-xl font-bold">
                            {fighter.draws}
                          </p>
                        </div>

                      </div>

                      <div className="mt-5 text-sm text-zinc-600 transition group-hover:text-red-500">
                        Открыть профиль →
                      </div>

                    </button>
                  ))}

                </div>
              )}

            </section>
          </>
        )}

        {/* ================= FIGHTS ================= */}

        {activeTab === "fights" && (
          <section>

            <div className="mb-5">
              <h2 className="text-2xl font-bold">
                Поединки
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Планирование, результаты и история боёв
              </p>
            </div>

            {fights.length === 0 ? (
              <EmptyState
                icon="🥊"
                title="Поединков пока нет"
                text="Добавь первый запланированный поединок."
                buttonText="Добавить поединок"
                onClick={() => setIsFightModalOpen(true)}
              />
            ) : (
              <div className="space-y-4">

                {fights.map((fight) => (
                  <button
                    key={fight.id}
                    onClick={() =>
                      setSelectedFightId(fight.id)
                    }
                    className="group w-full rounded-2xl border border-zinc-800 bg-[#111419] p-6 text-left transition hover:border-red-600"
                  >

                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                      <div>

                        <p className="text-sm text-zinc-500">
                          {fight.date}
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                          {fight.fighter}

                          <span className="mx-3 text-zinc-700">
                            VS
                          </span>

                          {fight.opponent}
                        </h3>

                        <p className="mt-2 text-sm text-zinc-500">
                          {fight.weight} · {fight.location}
                        </p>

                      </div>

                      <div className="flex items-center gap-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            fight.result === "Победа"
                              ? "bg-green-500/10 text-green-500"
                              : fight.result === "Поражение"
                              ? "bg-red-500/10 text-red-500"
                              : fight.result === "Ничья"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {fight.result}
                        </span>

                        <span className="text-zinc-600 transition group-hover:text-red-500">
                          →
                        </span>

                      </div>

                    </div>

                  </button>
                ))}

              </div>
            )}

          </section>
        )}

        {/* ================= NOTES ================= */}

        {activeTab === "notes" && (
          <section>

            <div className="mb-5">
              <h2 className="text-2xl font-bold">
                Заметки
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Тренерские записи и важная информация
              </p>
            </div>

            {notes.length === 0 ? (
              <EmptyState
                icon="📝"
                title="Заметок пока нет"
                text="Создай первую заметку для своей команды."
                buttonText="Добавить заметку"
                onClick={() => setIsNoteModalOpen(true)}
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() =>
                      setSelectedNoteId(note.id)
                    }
                    className="group rounded-2xl border border-zinc-800 bg-[#111419] p-6 text-left transition hover:-translate-y-1 hover:border-red-600"
                  >

                    <p className="text-xs text-zinc-600">
                      {note.date}
                    </p>

                    <h3 className="mt-3 text-xl font-bold">
                      {note.title}
                    </h3>

                    <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                      {note.text}
                    </p>

                    <div className="mt-5 text-sm text-zinc-600 transition group-hover:text-red-500">
                      Открыть заметку →
                    </div>

                  </button>
                ))}

              </div>
            )}

          </section>
        )}

      </div>

      {/* ================= ADD FIGHTER MODAL ================= */}

      {isFighterModalOpen && (
        <Modal
          title="Добавить бойца"
          subtitle="Создание нового профиля"
          onClose={() => setIsFighterModalOpen(false)}
        >
          <div className="space-y-4">

            <input
              value={fighterName}
              onChange={(e) => setFighterName(e.target.value)}
              placeholder="Имя и фамилия"
              className={inputClass}
            />

            <div className="grid grid-cols-2 gap-4">

              <input
                value={fighterAge}
                onChange={(e) => setFighterAge(e.target.value)}
                type="number"
                placeholder="Возраст"
                className={inputClass}
              />

              <input
                value={fighterHeight}
                onChange={(e) =>
                  setFighterHeight(e.target.value)
                }
                type="number"
                placeholder="Рост, см"
                className={inputClass}
              />

            </div>

            <input
              value={fighterWeight}
              onChange={(e) =>
                setFighterWeight(e.target.value)
              }
              type="number"
              placeholder="Вес, кг"
              className={inputClass}
            />

            <button
              onClick={addFighter}
              className={buttonClass}
            >
              Добавить бойца
            </button>

          </div>
        </Modal>
      )}

      {/* ================= ADD FIGHT MODAL ================= */}

      {isFightModalOpen && (
        <Modal
          title="Добавить поединок"
          subtitle="Планирование боя"
          onClose={() => setIsFightModalOpen(false)}
        >
          <div className="space-y-4">

            <input
              value={fightFighter}
              onChange={(e) =>
                setFightFighter(e.target.value)
              }
              placeholder="Ваш боец"
              className={inputClass}
            />

            <input
              value={fightOpponent}
              onChange={(e) =>
                setFightOpponent(e.target.value)
              }
              placeholder="Соперник"
              className={inputClass}
            />

            <input
              value={fightDate}
              onChange={(e) =>
                setFightDate(e.target.value)
              }
              type="date"
              className={inputClass}
            />

            <input
              value={fightWeight}
              onChange={(e) =>
                setFightWeight(e.target.value)
              }
              placeholder="Весовая категория"
              className={inputClass}
            />

            <input
              value={fightLocation}
              onChange={(e) =>
                setFightLocation(e.target.value)
              }
              placeholder="Место проведения"
              className={inputClass}
            />

            <button
              onClick={addFight}
              className={buttonClass}
            >
              Добавить поединок
            </button>

          </div>
        </Modal>
      )}

      {/* ================= ADD NOTE MODAL ================= */}

      {isNoteModalOpen && (
        <Modal
          title="Добавить заметку"
          subtitle="Тренерская запись"
          onClose={() => setIsNoteModalOpen(false)}
        >
          <div className="space-y-4">

            <input
              value={noteTitle}
              onChange={(e) =>
                setNoteTitle(e.target.value)
              }
              placeholder="Заголовок"
              className={inputClass}
            />

            <textarea
              value={noteText}
              onChange={(e) =>
                setNoteText(e.target.value)
              }
              placeholder="Текст заметки..."
              rows={6}
              className={`${inputClass} resize-none`}
            />

            <button
              onClick={addNote}
              className={buttonClass}
            >
              Сохранить заметку
            </button>

          </div>
        </Modal>
      )}

    </main>
  );
}

/*
 * SMALL UI COMPONENTS
 */

const inputClass =
  "w-full rounded-xl border border-zinc-800 bg-[#0b0d10] px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-red-600";

const buttonClass =
  "w-full rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-500";

function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#111419] p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold">
              {title}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-zinc-500 hover:text-white"
          >
            ×
          </button>

        </div>

        {children}

      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
  buttonText,
  onClick,
}: {
  icon: string;
  title: string;
  text: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-[#111419] p-16 text-center">

      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
        {text}
      </p>

      <button
        onClick={onClick}
        className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
      >
        {buttonText}
      </button>

    </div>
  );
}