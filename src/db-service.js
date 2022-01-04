export class DBService {

  constructor(Model) {
    this.Model = Model;
  }

  async loadTableToDatabase(table) {

    for (const item of table) {
      await this.insert(item);
    }
  }

  async insert({ column, id, value }) {
    const data = await this.Model.findByPk(id);
    if (data) this.Model.update({ [column]: value }, { where: { id } });
    else await this.Model.create({ id, [column]: value });
  }
}