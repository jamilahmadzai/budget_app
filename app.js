const type = document.querySelector(".add__type");
const description = document.querySelector(".add__description");
const inputValue = document.querySelector(".add__value");
const btn = document.querySelector(".add__btn");
const incomeContainer = document.querySelector(".income__list");
const expenseContainer = document.querySelector(".expenses");
const budgetVal = document.querySelector(".budget__value");
const incVal = document.querySelector(".budget__income--value");
const expenseVal = document.querySelector(".budget__expenses--value");
const perVal = document.querySelector(".budget__expenses--percentage");
const container = document.querySelector(".container");
const date = document.querySelector(".budget__title--month");

//Budget Controller Module
const budgetController = (() => {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    console.log(totalIncome);
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = type => {
    let sum = 0;
    data.allItems[type].forEach(e => {
      sum += e.value;
    });
    data.total[type] = sum;
  };

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    total: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: (type, des, val) => {
      let newItem, ID;

      //create new ID for each item
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else ID = 0;
      //create new item base on inc or exp type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //push and rturn new item
      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: (type, id) => {
      const ids = data.allItems[type].map(e => {
        return e.id;
      });
      const index = ids.indexOf(id);
      console.log(index);
      if (index != -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: () => {
      //calculate total income and expenses
      calculateTotal("inc");
      calculateTotal("exp");

      //calculate the budget: income - expenses
      data.budget = data.total.inc - data.total.exp;

      //calculate the percentage of income that we have spent
      if (data.total.inc > 0) {
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else data.percentage = -1;
    },

    calculatePercentages: () => {
      data.allItems.exp.forEach(e => {
        e.calcPercentage(data.total.inc);
      });
    },
    getPercentages: () => {
      const allPerc = data.allItems.exp.map(e => {
        return e.getPercentage();
      });
      return allPerc;
    },

    getBudget: () => {
      return {
        budget: data.budget,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage
      };
    }
  };
})();

//UI Controller Module
const UIController = (() => {
  formatNumber = (num, type) => {
    num = Math.abs(num);
    num = num.toFixed(2);

    const numSplit = num.split(".");

    let int = numSplit[0];
    if (int.length > 3) {
      int.substr(0, 1);
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    const dec = numSplit[1];

    return `${type === "exp" ? "-" : "+"} ${int}.${dec}`;
  };

  const nodeList = (list, callback) => {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: () => {
      return {
        type: type.value,
        description: description.value,
        inputValue: parseFloat(inputValue.value)
      };
    },
    addListItem: (obj, type) => {
      let html, newHtml, element;
      if (type === "inc") {
        element = incomeContainer;
        html = `<div class="item clearfix" id="inc-%id%">
                            <div class="item__description">%description%</div>
                            <div class="right clearfix">
                                <div class="item__value">%value%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                </div>`;
      } else if (type === "exp") {
        element = expenseContainer;
        html = `<div class="item clearfix" id="exp-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                      <div class="item__value">%value%</div>
                      <div class="item__percentage">21%</div>
                        <div class="item__delete">
                          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
      }

      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      element.insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: ID => {
      const el = document.getElementById(ID);
      el.parentNode.removeChild(el);
    },

    clearFields: () => {
      let fields, fieldsArr;
      //fields = description;
      fields = document.querySelectorAll(
        ".add__description" + ", " + ".add__value"
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(current => {
        current.value = "";
      });
      fieldsArr[0].focus();
    },

    budgetUI: obj => {
      let type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      budgetVal.textContent = formatNumber(obj.budget, type);
      incVal.textContent = formatNumber(obj.totalInc, "inc");
      expenseVal.textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0 && obj.percentage <= 100) {
        perVal.textContent = obj.percentage + "%";
      } else {
        perVal.textContent = "--";
      }
    },

    displayPercentages: percentages => {
      nodeList(
        document.querySelectorAll(".item__percentage"),
        (current, index) => {
          if (percentages > 0 && percentages <= 100) {
            current.textContent = percentages[index] + "%";
          } else current.textContent = "----";
        }
      );
    },

    displayMonth: () => {
      const now = new Date();
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "Septmber",
        "October",
        "November",
        "December"
      ];
      const month = now.getMonth();
      const year = now.getFullYear();
      date.textContent = `${months[month]} ${year}`;
    },

    changedType: () => {
      const fields = document.querySelectorAll(
        ".add__type" + "," + ".add__description" + "," + ".add__value"
      );

      nodeList(fields, function(e) {
        e.classList.toggle("red-focus");
      });
      btn.classList.toggle("red");
    }
  };
})();

//App  Controller Module
const controller = ((UICtrl, budgetCtrl) => {
  const setEventListener = () => {
    btn.addEventListener("click", () => {
      ctrlAdd();
    });

    description.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAdd();
      }
    });

    inputValue.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAdd();
      }
    });

    container.addEventListener("click", deleteItem);

    type.addEventListener("change", UICtrl.changedType);
  };

  const updateBudget = () => {
    //calculate the budget
    budgetCtrl.calculateBudget();
    //return the budget
    const bud = budgetCtrl.getBudget();

    //display the budget on UI
    UICtrl.budgetUI(bud);
  };

  const updatePercentage = () => {
    budgetCtrl.calculatePercentages();

    const percentages = budgetCtrl.getPercentages();

    console.log(percentages);

    UICtrl.displayPercentages(percentages);
  };

  const ctrlAdd = () => {
    const input = UICtrl.getInput();

    if (
      input.description !== "" &&
      !isNaN(input.inputValue) &&
      input.inputValue > 0
    ) {
      const newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.inputValue
      );
      console.log(newItem);

      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();

      updateBudget();

      updatePercentage();
    }
  };

  const deleteItem = e => {
    let splitID, type, ID;
    const itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      budgetCtrl.deleteItem(type, ID);

      UICtrl.deleteListItem(itemID);

      updateBudget();

      updatePercentage();
    }
  };

  return {
    init: () => {
      setEventListener();
      UICtrl.displayMonth();
      UICtrl.budgetUI({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
    }
  };
})(UIController, budgetController);

controller.init();
