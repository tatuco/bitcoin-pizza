let pizzas = [];
let userInteracted = false;
const COOKING = 1
const FINISHED = 2
const status = [
    COOKING,
    FINISHED
]

const init = () => {
    fetch('/pizzas')
    .then(response => response.json())
    .then(result => {    
        pizzas = result
    })
    .catch((error) => {
      console.error('Error fetching pizzas:', error);
    });
}

const types = [
    'USDT',
    'CARDANO',
    'TRON',
    'RIPPLE',
    'DOGECOIN',
    'ETHEREUM',
    'BITCOIN',
    'CALZON'
]

const songs = {
    almost_done: new Audio('songs/almost_done.mp3'),
    done: new Audio('songs/done.mp3'),
}

const addPizza = () => {
  const name = document.getElementById('pizza-name').value;
  const cookTime = parseInt(document.getElementById('cook-time').value);
  const type = document.getElementById('pizza-type').value;


  if (!name || !cookTime || !type) {
    alert('Please provide both name and cook time for the pizza.');
    return;
  }

  const pizza = {
    name,
    cookTime,
    type,
    addedTime: Date.now(),
    status: COOKING
  }

  fetch('/addPizza', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pizza),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Pizza added:', data);
      pizzas.push(pizza);
      updatePizzaList();
    })
    .catch((error) => {
      console.error('Error adding pizza:', error);
    });
};

const updatePizzaList = () => {
    console.log(pizzas)
    const pizzaList = document.getElementById('pizza-list');
    pizzaList.innerHTML = '';
  
    pizzas.forEach((pizza) => {
      const elapsedTime = (Date.now() - pizza.addedTime) / 1000 / 60; // convert ms to minutes
      const timeLeft = pizza.cookTime - elapsedTime;
  
      let statusText = 'Horneando';
      if (timeLeft <= 0) {
        statusText = 'Lista';
      } else if (timeLeft <= 1) {
        statusText = 'Casi lista';
      }
  
      const pizzaItem = document.createElement('div');
      pizzaItem.classList.add('pizza-item');
      pizzaItem.innerHTML = `
        <h2>${pizza.name} (${pizza.type})</h2>
        <p>Tiempo restante: ${Math.max(timeLeft, 0).toFixed(1)} minutos</p>
        <p>Estado: ${statusText}</p>
        <button id="button-${pizza.id}" onclick="markAsFinished(${pizza.id})">Lista</button>
      `;
  
      pizzaList.appendChild(pizzaItem);
  
      if (!userInteracted || pizza.status === FINISHED) return;
      if (timeLeft <= 1 && timeLeft > 0) {
        document.getElementById(`button-${pizza.id}`).style.backgroundColor =  '#FFD700'
      } else if (timeLeft <= 0.1) {
        document.getElementById(`button-${pizza.id}`).style.backgroundColor =  '#FF0000'
        songs.done.play().catch(error => {
            console.error('Error playing audio:', error);
          });
      }
    });
  };

const markAsFinished = (id) => {
    fetch('/finishPizza', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          pizzas = pizzas.filter(pizza => pizza.id !== id)
          updatePizzaList();
        })
        .catch((error) => {
          console.error('Error marking pizza as finished:', error);
        });
};

const populatePizzaTypes = () => {
    const pizzaTypeSelect = document.getElementById('pizza-type');
    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.text = type;
      pizzaTypeSelect.appendChild(option);
    });
  };

  const startApp = () => {
    userInteracted = true;
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    init()
    populatePizzaTypes();
    updatePizzaList();
    setInterval(updatePizzaList, 1000); // Update the list every second
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('app').style.display = 'none';
  });
