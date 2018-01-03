class AddOtherCat < ActiveRecord::Migration[5.1]
  def change
    Category.create(:name => "Other")
  end
end
