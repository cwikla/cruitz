class AddFakeExperience < ActiveRecord::Migration[5.1]
  def up
    Experience.reset_column_information

    Loader::add_fake_exp
  end

  def down
    Experience.delete_all
  end
end
