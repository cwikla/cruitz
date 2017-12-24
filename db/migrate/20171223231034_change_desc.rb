class ChangeDesc < ActiveRecord::Migration[5.1]
  def up
    change_column :reviews, :description, :text
  end

  def down
  end
end
