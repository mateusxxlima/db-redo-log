export class DBService {

  constructor(Model) {
    this.Model = Model;
  }

  async loadTableToDatabase(table) {

    for (const { column, id, value } of table) {  
      const data = await this.Model.findByPk(id)
      if (data) this.Model.update({ [column]: value }, { where: { id } })
      else await this.Model.create({ id, [column]: value })  
    }
  }
}