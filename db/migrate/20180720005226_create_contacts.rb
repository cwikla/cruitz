class CreateContacts < ActiveRecord::Migration[5.1]
  def change
    create_table :contacts do |t|
      t.timestamps
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone_number
      t.text :comment, null: false
    end
  end
end
