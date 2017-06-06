class CreateCompanies < ActiveRecord::Migration[5.0]
  def change
    create_table :companies do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.string :name, :null => false
      t.text :description
    end

    add_index :companies, [:name]

  end
end
