fetch('https://suvihasa-yoga-d7gnexcjcke9bucu.canadacentral-01.azurewebsites.net/api/classes')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('classes');
    data.forEach(cls => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${cls.title}</h3><p>${cls.style}</p>`;
      container.appendChild(div);
    });
  });
