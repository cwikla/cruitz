class SeedUni < ActiveRecord::Migration[5.1]
  def up
    University.reset_column_information

    path = Rails.root.join('db', 'data', 'uni.txt')

    File.open(path).each do |l|
      pieces = l.split("\t")
      rank = pieces[0].to_i
      name = pieces[1]
      University.create(name: name.strip(), rank: rank)
      puts "#{rank} => #{name}"
    end
  end

  def down
    University.delete_all
  end
end
