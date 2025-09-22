let movies = [
  { title: "A Freira", year: 2018, watched: true, chooser: "Cay", date: "?" },
  {
    title: "Annabelle 2: A Criação do Mal",
    year: 2017,
    watched: true,
    chooser: "Cay",
    date: "28/07/2025",
  },
  {
    title: "A Freira 2",
    year: 2023,
    watched: true,
    chooser: "Cay",
    date: "30/07/2025",
  },
  {
    title: "Annabelle",
    year: 2014,
    watched: true,
    chooser: "Cay",
    date: "03/08/2025",
  },
  {
    title: "Invocação do Mal",
    year: 2013,
    watched: true,
    chooser: "Cay",
    date: "04/08/2025",
  },
  {
    title: "Annabelle 3: De Volta Para Casa",
    year: 2019,
    watched: true,
    chooser: "Cay",
    date: "13/08/2025",
  },
  {
    title: "A Maldição da Chorona",
    year: 2019,
    watched: true,
    chooser: "Cay",
    date: "14/08/2025",
  },
  {
    title: "Invocação do Mal 2",
    year: 2016,
    watched: true,
    chooser: "Cay",
    date: "17/08/2025",
  },
  {
    title: "Invocação do Mal 3",
    year: 2021,
    watched: true,
    chooser: "Cay",
    date: "21/08/2025",
  },
  {
    title: "Invocação do Mal 4",
    year: 2025,
    watched: false,
    chooser: "Cay",
    date: "?",
  },
  {
    title: "Toy Story",
    year: 1995,
    watched: true,
    chooser: "Kan",
    date: "26/08/2025",
  },
  {
    title: "Sexta feira 13",
    year: 2009,
    watched: true,
    chooser: "Bingus",
    date: "28/08/2025",
  },
  {
    title: "Vingadores: Era de Ultron",
    year: 2015,
    watched: true,
    chooser: "Batata",
    date: "09/09/2025",
  },
  {
    title: "As Aventuras de Pi",
    year: 2012,
    watched: true,
    chooser: "Blaz",
    date: "13/09/2025",
  },
  {
    title: "Pearl",
    year: 2022,
    watched: true,
    chooser: "Selene",
    date: "16/09/2025",
  },
  {
    title: "A Morte do Demônio",
    year: 2013,
    watched: true,
    chooser: "Mary",
    date: "18/09/2025",
  },
  {
    title: "O Homem nas Trevas 2",
    year: 2021,
    watched: false,
    chooser: "Cami",
    date: "22/09/2025",
  },
  {
    title: "Descendentes",
    year: 2015,
    watched: false,
    chooser: "Isa",
    date: "?",
  },
];

let editingIndex = -1;

function renderTable() {
  const tbody = document.getElementById("moviesBody");
  tbody.innerHTML = "";

  movies.forEach((movie, index) => {
    const row = tbody.insertRow();
    row.innerHTML = `
                    <td>${movie.title}</td>
                    <td>${movie.year || "-"}</td>
                    <td><span class="status-badge ${
                      movie.watched ? "watched" : "not-watched"
                    }">${
      movie.watched ? "✅ Assistido" : "❌ Pendente"
    }</span></td>
                    <td>${movie.chooser || "-"}</td>
                    <td>${movie.date || "-"}</td>
                    <td class="actions">
                        <button class="btn-action btn-edit" onclick="editMovie(${index})">✏️</button>
                        <button class="btn-action btn-delete" onclick="deleteMovie(${index})">🗑️</button>
                    </td>
                `;
  });

  updateStats();
}

function updateStats() {
  const total = movies.length;
  const watched = movies.filter((m) => m.watched).length;
  const pending = total - watched;

  document.getElementById("totalMovies").textContent = total;
  document.getElementById("watchedMovies").textContent = watched;
  document.getElementById("pendingMovies").textContent = pending;
}

function openModal() {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modalTitle").textContent = "Adicionar Filme";
  document.getElementById("movieForm").reset();
  editingIndex = -1;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function editMovie(index) {
  const movie = movies[index];
  editingIndex = index;

  document.getElementById("modalTitle").textContent = "Editar Filme";
  document.getElementById("movieTitle").value = movie.title;
  document.getElementById("movieYear").value = movie.year || "";
  document.getElementById("movieStatus").value = movie.watched
    ? "watched"
    : "not-watched";
  document.getElementById("movieChooser").value = movie.chooser || "";

  if (movie.date && movie.date !== "?") {
    const parts = movie.date.split("/");
    if (parts.length === 3) {
      document.getElementById(
        "movieDate"
      ).value = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  document.getElementById("modal").style.display = "flex";
}

function deleteMovie(index) {
  if (confirm("Tem certeza que deseja excluir este filme?")) {
    movies.splice(index, 1);
    renderTable();
    saveData();
  }
}

document.getElementById("movieForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const movie = {
    title: document.getElementById("movieTitle").value,
    year: parseInt(document.getElementById("movieYear").value) || null,
    watched: document.getElementById("movieStatus").value === "watched",
    chooser: document.getElementById("movieChooser").value || null,
    date: document.getElementById("movieDate").value
      ? new Date(document.getElementById("movieDate").value).toLocaleDateString(
          "pt-BR"
        )
      : "?",
  };

  if (editingIndex >= 0) {
    movies[editingIndex] = movie;
  } else {
    movies.push(movie);
  }

  renderTable();
  closeModal();
  saveData();
});

function filterMovies() {
  const searchTerm = document.getElementById("searchBar").value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;
  const chooserFilter = document.getElementById("chooserFilter").value;

  const tbody = document.getElementById("moviesBody");
  const rows = tbody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const movie = movies[i];
    let show = true;

    if (searchTerm && !movie.title.toLowerCase().includes(searchTerm)) {
      show = false;
    }

    if (statusFilter !== "all") {
      if (statusFilter === "watched" && !movie.watched) show = false;
      if (statusFilter === "not-watched" && movie.watched) show = false;
    }

    if (chooserFilter !== "all" && movie.chooser !== chooserFilter) {
      show = false;
    }

    rows[i].style.display = show ? "" : "none";
  }
}

function saveData() {
  localStorage.setItem("cinecayMovies", JSON.stringify(movies));
}

function loadData() {
  const saved = localStorage.getItem("cinecayMovies");
  if (saved) {
    try {
      movies = JSON.parse(saved);
    } catch (e) {
      console.error("Erro ao carregar dados salvos");
    }
  }
  renderTable();
}

function exportData() {
  const dataStr = JSON.stringify(movies, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `cinecay-movies-${
    new Date().toISOString().split("T")[0]
  }.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

function importData() {
  document.getElementById("fileInput").click();
}

document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (Array.isArray(imported)) {
        movies = imported;
        renderTable();
        saveData();
        alert("Dados importados com sucesso!");
      } else {
        alert("Formato de arquivo inválido");
      }
    } catch (error) {
      alert("Erro ao importar arquivo: " + error.message);
    }
  };
  reader.readAsText(file);
});

window.onclick = function (event) {
  if (event.target == document.getElementById("modal")) {
    closeModal();
  }
};

loadData();