const admin = ["niczad", "1234"]
before(() => {
  cy.request("http://localhost:3000/users/resetDB")
})
describe("site", () => {
  it("pages", () => {
    cy.visit("localhost:3000")
    cy.get("a[href]").each(link => {
      cy.request(link.prop("href"))
    })
  })
  it("login", () => {
    cy.visit("localhost:3000/home")
    cy.get("form")
    const users = [
      ["not_exist", "1111", "نام کاربری یا رمز عبور اشتباه است"],
      ["niczad", "1111", "نام کاربری یا رمز عبور اشتباه است"],
      ["not_exist", "1234", "نام کاربری یا رمز عبور اشتباه است"],
      ["niczad", "1234", "با موفقیت وارد شدید"],
    ]
    users.forEach(v => {
      cy.get("form input").each((inp, i) => {
        inp.val(v[i])
      })
      cy.get("form [type='submit']").click()
      cy.get(".dialog.response").contains(v.pop())
    })
  })
})
describe("users", () => {
  const users = [
    ["wbendelow0", "CeRUfw8mIx", "standard"],
    ["fpeet1", "CJlnq9", "standard"],
    ["ifashion2", "Jd3w4vOzk", "standard"],
    ["nbrickwood3", "Kg0XjVsN", "admin"],
    ["kcattell4", "xWV7mFmB0", "standard"],
  ]
  beforeEach(() => {
    cy.visit("http://localhost:3000")
    cy.get("form input").each((inp, i) => {
      inp.val(admin[i])
    })
    cy.get("form [type='submit']").click()
    cy.visit("http://localhost:3000/users")
  })
  it("can add user", () => {
    users.forEach((u, i) => {
      cy.get(".dialog.add").should("not.be.visible")
      cy.get("button.iconBtn.add").click()
      const dialog = cy.get(".dialog.add")
      cy.get(".dialog.add").should("be.visible")
      cy.get(".dialog.add [data-key]").each((inp, i) => {
        if (i < 3) inp.val(u[i])
      })
      cy.get(".dialog.add .btn.accept").click()
      dialog.should("not.be.visible")
      cy.get(`[data-item] > tr:nth-child(${i + 2}) > td`).each((td, i) => {
        if (i < 2) expect(td.text()).equal(u[i > 0 ? i + 1 : i])
      })
    })
    cy.visit("http://localhost:3000/users").then(() => {
      const currentUsers: string[][] = []
      cy.get(`[data-item] > tr`)
        .each(tr => {
          const user: string[] = []
          currentUsers.push(user)
          tr.children("td").each((i, td) => {
            user.push(td.textContent)
          })
        })
        .then(() => {
          users.push(["niczad", "1234", "admin"])
          const u1 = users.sort((a, b) => (a[0] >= b[0] ? 1 : -1))
          const u2 = currentUsers.sort((a, b) => (a[0] >= b[0] ? 1 : -1))
          u1.forEach((u, i) => {
            expect(u[0]).equal(u2[i][0])
            expect(u[2]).equal(u2[i][1])
          })
        })
    })
  })
  it("can delete user", () => {
    cy.contains("td", "fpeet1").parent().find(".iconBtn.remove").click()
    cy.contains("td", "fpeet1").should("not.exist")
    cy.visit("http://localhost:3000/users").then(() => {
      cy.contains("td", "fpeet1").should("not.exist")
    })
  })
  it("can edit user", () => {
    const newUsername = "edited"
    cy.get(".dialog.edit").should("not.be.visible")
    cy.contains("td", "ifashion2").parent().find(".edit").click()
    cy.get(".dialog.edit")
      .should("be.visible")
      .within(elm => {
        cy.get("[data-key='username']")
          .should("have.value", "ifashion2")
          .clear()
          .type(newUsername)
        cy.get("[data-key='auth']").should("have.value", "standard")
        cy.get(".accept").click()
      })
    cy.get(".dialog.edit").should("not.be.visible")
    cy.contains("td", newUsername)
    cy.visit("http://localhost:3000/users").then(() => {
      cy.contains("td", newUsername)
    })
  })
  it("show user's data", () => {
    cy.contains("niczad").click()
    cy.get(".dialog.watch").within(() => {
      cy.contains("span", "نام کاربری:").next().contains("niczad")
      cy.contains("span", "سطح دسترسی:").next().contains("admin")
    })
  })
  it("can search user", () => {
    cy.contains("td", "wbendelow0").should("be.visible")
    cy.get("[data-key='search']").clear().type("niczad")
    cy.contains("td", "niczad").should("be.visible")
    cy.contains("td", "wbendelow0").should("not.be.visible")
  })
})
describe("customers", () => {
  const customers = [
    ["Major", "7391154169"],
    ["Fania", "3881829339"],
  ]
  const customersWithPlace = [
    ["Brook", "5783409473", "Wink", "Merida", "1678622782", "17 Farmco Place"],
    [
      "Nicola",
      "2404295016",
      "Kilgour",
      "Handslip",
      "4446651121",
      "8315 Hayes Avenue",
    ],
    [
      "Stanfield",
      "7611391959",
      "Lebel",
      "Habishaw",
      "4281300144",
      "4 Nevada Place",
    ],
  ]
  const cusMultiPhone = ["Clerkclaude", ["9253402421", "3885349339"]]
  beforeEach(() => {
    cy.visit("http://localhost:3000")
    cy.get("form input").each((inp, i) => {
      inp.val(admin[i])
    })
    cy.get("form [type='submit']").click()
    cy.visit("http://localhost:3000/customers")
  })
  it("can add customer", () => {
    customers.forEach(c => {
      cy.get(".dialog.add").should("not.be.visible")
      cy.get(".customers button.iconBtn.add").click()
      cy.get(".dialog.add").should("be.visible")
      cy.get(".dialog.add").within(() => {
        cy.get("[data-key='name']").first().type(c[0])
        cy.get(".phone input").first().type(c[1])
        cy.get(".phone .iconBtn.add").first().click()
      })
      cy.get(".dialog.add .accept").click()
    })
    cy.contains("Major")
    cy.contains("7391154169")
    cy.contains("Fania")
    cy.contains("3881829339")
  })
  it("can add customer with multy phone", () => {
    cy.get(".dialog.add").should("not.be.visible")
    cy.get(".customers button.iconBtn.add").click()
    cy.get(".dialog.add").should("be.visible")
    cy.get(".dialog.add").within(() => {
      cy.get("[data-key='name']")
        .first()
        .type(cusMultiPhone[0] as string)
      cy.get(".phone input").first().clear().type(cusMultiPhone[1][0])
      cy.get(".phone .iconBtn.add").first().click()
      cy.get(".phone input").first().clear().type(cusMultiPhone[1][1])
      cy.get(".phone .iconBtn.add").first().click()
    })
    cy.get(".dialog.add .accept").click()
    cy.contains("Clerkclaude")
    cy.contains("9253402421")
    cy.contains("3885349339")
  })
  it("can add customer with place", () => {
    customersWithPlace.forEach(c => {
      cy.get(".dialog.add").should("not.be.visible")
      cy.get(".customers button.iconBtn.add").click()
      cy.get(".dialog.add").should("be.visible")
      cy.get(".dialog.add").within(() => {
        cy.get("[data-key='name']").first().type(c[0])
        cy.get(".phone input").first().type(c[1])
        cy.get(".phone .iconBtn.add").first().click()

        cy.get("[data-branch='place']").within(() => {
          cy.get("[data-key='name']").first().type(c[2])
          cy.get("[data-key='type']").first().type(c[3])
          cy.get("[data-key='address']").first().type(c[5])
          cy.get(".phone input").first().type(c[4])
          cy.get(".phone .iconBtn.add").first().click()
        })
      })
      cy.get(".dialog.add .accept").click()
    })
    cy.get(".dialog.add").should("not.be.visible")
    cy.get("main table > tbody").within(() => {
      customersWithPlace.forEach(c => {
        c.slice(0, 3).forEach(v => cy.contains(v))
      })
    })
  })
  it("can delete customer", () => {
    cy.contains("Nicola").parent().find(".iconBtn.remove").click()
    cy.get("main table > tbody").within(() => {
      cy.contains("td", "Nicola").should("not.exist")
    })
  })
  it("can edit customer", () => {
    cy.get(".dialog.edit").should("not.be.visible")
    cy.contains("Stanfield").parent().find(".iconBtn.edit").click()
    cy.get(".dialog.edit")
      .should("be.visible")
      .within(() => {
        cy.get("[data-key='name']").first().clear().type("Stunning")
        cy.get("[data-branch] [data-key='name']")
          .first()
          .clear()
          .type("shit place")
        cy.get(".accept").click()
      })
    cy.contains("td", "Stunning")
      .parent()
      .within(() => {
        cy.contains("shit place")
      })
  })
  it("can show customer", () => {
    cy.get(".dialog.watch").should("not.be.visible")
    cy.contains("td", "Brook").click()
    cy.get(".dialog.watch")
      .should("be.visible")
      .within(() => {
        customersWithPlace[0].forEach(s => {
          cy.contains(s)
        })
      })
  })
  it("can search customer", () => {
    cy.get("input[data-key='search']").clear().type("Brook")
    cy.get("table > tbody").within(() => {
      cy.contains("Brook").should("be.visible")
      cy.contains("Stunning").should("not.be.visible")
      cy.contains("Fania").should("not.be.visible")
      cy.contains("Major").should("not.be.visible")
    })
  })
})
describe("orders", () => {
  const today = formatDate(new Date(Date.now()))
  const tommorow = "2023-01-26"
  const orders = [
    {
      select: "Brook",
      location: "طبقه جنگلی",
      count: 60,
      date: today,
      startTime: "11:00",
      duration: "2:10",
      gender: "پسرانه",
      type: "سالن در اختیار",
      pricePerPerson: "100000",
      discount: "10",
      note: "eee",
    },
    {
      select: "Fania",
      location: "طبقه ساحلی",
      count: 200,
      date: tommorow,
      startTime: "17:00",
      duration: "3:30",
      gender: "پسرانه",
      type: "سالن در اختیار",
      pricePerPerson: "100000",
      discount: "10",
      note: "eee",
    },
  ]
  beforeEach(() => {
    cy.visit("http://localhost:3000/")
    cy.get("form input").each((inp, i) => {
      inp.val(admin[i])
    })
    cy.get("form [type='submit']").click()
    cy.visit("http://localhost:3000/orders")
  })
  it("can add order", () => {
    orders.forEach(c => {
      cy.get(".dialog.add").should("not.be.visible")
      cy.get(".orders > .iconBtn.add").click()
      cy.get(".dialog.add").should("be.visible")
      cy.get(".dialog.add").within(() => {
        cy.get("select").select(c.select)
        Object.keys(c).forEach((k: keyof typeof c) => {
          if (k === "select") return
          cy.get(`[data-key="${k}"]`)
            .clear()
            .type(c[k] as string)
        })
      })
      cy.get(".dialog.add .accept").click()
    })
    cy.contains("طبقه جنگلی")
  })
  // it("can delete order", () => {})
  // it("can edit order", () => {})
  // it("can show order", () => {})
  // it("can search order", () => {})
})
function formatDate(date: Date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = "0" + month
  if (day.length < 2) day = "0" + day

  return [year, month, day].join("-")
}
